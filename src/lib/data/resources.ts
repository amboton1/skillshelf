import { and, count, desc, eq, inArray } from "drizzle-orm";
import db from "@/db";
import {
  bookmarks,
  categories,
  comments,
  purchases,
  resourceFiles,
  resourceLikes,
  resources,
  users,
} from "@/db/schema";
import { stackServerApp } from "@/stack/server";

export type ResourceWithCategory = typeof resources.$inferSelect & {
  category: typeof categories.$inferSelect | null;
  creatorName: string | null;
};

async function getDbUser() {
  const user = await stackServerApp.getUser();
  if (!user) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  return dbUser ?? null;
}

export async function getResources(): Promise<ResourceWithCategory[]> {
  const result = await db
    .select({
      resource: resources,
      category: categories,
      creatorName: users.name,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .leftJoin(users, eq(resources.creatorId, users.id));

  return result.map(({ resource, category, creatorName }) => ({
    ...resource,
    category,
    creatorName,
  }));
}

export async function getUsersResources(): Promise<ResourceWithCategory[]> {
  const dbUser = await getDbUser();
  if (!dbUser) return [];

  const result = await db
    .select({
      resource: resources,
      category: categories,
      creatorName: users.name,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .leftJoin(users, eq(resources.creatorId, users.id))
    .where(eq(resources.creatorId, dbUser.id));

  return result.map(({ resource, category, creatorName }) => ({
    ...resource,
    category,
    creatorName,
  }));
}

export async function getDashboardStats() {
  const dbUser = await getDbUser();
  if (!dbUser) return null;

  const userResources = await db
    .select({ id: resources.id, published: resources.published })
    .from(resources)
    .where(eq(resources.creatorId, dbUser.id));

  const resourceIds = userResources.map((r) => r.id);
  const publishedCount = userResources.filter((r) => r.published).length;
  const draftCount = userResources.length - publishedCount;

  if (resourceIds.length === 0) {
    return {
      publishedCount,
      draftCount,
      totalSales: 0,
      totalLikes: 0,
      mostLikedResource: null,
    };
  }

  const [salesRow] = await db
    .select({ total: count() })
    .from(purchases)
    .where(inArray(purchases.resourceId, resourceIds));

  const [likesRow] = await db
    .select({ total: count() })
    .from(resourceLikes)
    .where(inArray(resourceLikes.resourceId, resourceIds));

  const likesByResource = await db
    .select({ resourceId: resourceLikes.resourceId, total: count() })
    .from(resourceLikes)
    .where(inArray(resourceLikes.resourceId, resourceIds))
    .groupBy(resourceLikes.resourceId)
    .orderBy(count())
    .limit(1);

  let mostLikedResource: { title: string; likes: number } | null = null;
  if (likesByResource.length > 0) {
    const [resource] = await db
      .select({ title: resources.title })
      .from(resources)
      .where(eq(resources.id, likesByResource[0].resourceId));
    if (resource) {
      mostLikedResource = {
        title: resource.title,
        likes: likesByResource[0].total,
      };
    }
  }

  return {
    publishedCount,
    draftCount,
    totalSales: salesRow?.total ?? 0,
    totalLikes: likesRow?.total ?? 0,
    mostLikedResource,
  };
}

export async function getAnalyticsData() {
  const dbUser = await getDbUser();
  if (!dbUser) return null;

  const userResources = await db
    .select({
      id: resources.id,
      title: resources.title,
      published: resources.published,
      categoryId: resources.categoryId,
    })
    .from(resources)
    .where(eq(resources.creatorId, dbUser.id));

  const resourceIds = userResources.map((r) => r.id);

  if (resourceIds.length === 0) {
    return {
      likesByResource: [],
      salesByResource: [],
      categoryBreakdown: [],
      publishedVsDraft: { published: 0, draft: 0 },
    };
  }

  const [likesRaw, salesRaw] = await Promise.all([
    db
      .select({ resourceId: resourceLikes.resourceId, total: count() })
      .from(resourceLikes)
      .where(inArray(resourceLikes.resourceId, resourceIds))
      .groupBy(resourceLikes.resourceId)
      .orderBy(desc(count())),
    db
      .select({ resourceId: purchases.resourceId, total: count() })
      .from(purchases)
      .where(inArray(purchases.resourceId, resourceIds))
      .groupBy(purchases.resourceId)
      .orderBy(desc(count())),
  ]);

  const titleMap = Object.fromEntries(
    userResources.map((r) => [r.id, r.title]),
  );

  const likesByResource = likesRaw.map((row) => ({
    name: titleMap[row.resourceId] ?? "Unknown",
    value: row.total,
  }));

  const salesByResource = salesRaw.map((row) => ({
    name: titleMap[row.resourceId] ?? "Unknown",
    value: row.total,
  }));

  const categoryCounts: Record<string, number> = {};
  const categoryIds = [
    ...new Set(userResources.map((r) => r.categoryId).filter(Boolean)),
  ] as string[];

  let categoryNameMap: Record<string, string> = {};
  if (categoryIds.length > 0) {
    const cats = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(inArray(categories.id, categoryIds));
    categoryNameMap = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  }

  for (const r of userResources) {
    const label = r.categoryId
      ? (categoryNameMap[r.categoryId] ?? "Unknown")
      : "Uncategorized";
    categoryCounts[label] = (categoryCounts[label] ?? 0) + 1;
  }

  const categoryBreakdown = Object.entries(categoryCounts).map(
    ([name, value]) => ({ name, value }),
  );

  const publishedCount = userResources.filter((r) => r.published).length;

  return {
    likesByResource,
    salesByResource,
    categoryBreakdown,
    publishedVsDraft: {
      published: publishedCount,
      draft: userResources.length - publishedCount,
    },
  };
}

export async function getResourceBySlug(slug: string) {
  const [result] = await db
    .select({ resource: resources, category: categories })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .where(and(eq(resources.slug, slug), eq(resources.published, true)));

  if (!result) return null;

  const [likesRow] = await db
    .select({ total: count() })
    .from(resourceLikes)
    .where(eq(resourceLikes.resourceId, result.resource.id));

  const files = await db
    .select()
    .from(resourceFiles)
    .where(eq(resourceFiles.resourceId, result.resource.id));

  return {
    ...result.resource,
    category: result.category,
    likes: likesRow?.total ?? 0,
    fileUrl: files[0]?.fileUrl ?? null,
  };
}

export async function getResourceByID(id: string) {
  const [resource] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id));

  return resource;
}

export async function getUserResourceByID(id: string) {
  const dbUser = await getDbUser();
  if (!dbUser) return null;

  const [result] = await db
    .select({ resource: resources, category: categories })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .where(eq(resources.id, id));

  if (!result || result.resource.creatorId !== dbUser.id) return null;

  const files = await db
    .select()
    .from(resourceFiles)
    .where(eq(resourceFiles.resourceId, id));

  const [likesRow] = await db
    .select({ total: count() })
    .from(resourceLikes)
    .where(eq(resourceLikes.resourceId, id));

  const [salesRow] = await db
    .select({ total: count() })
    .from(purchases)
    .where(eq(purchases.resourceId, id));

  return {
    ...result.resource,
    category: result.category,
    files,
    likes: likesRow?.total ?? 0,
    sales: salesRow?.total ?? 0,
  };
}

export async function getComments(resourceId: string) {
  const result = await db
    .select({
      comment: comments,
      userName: users.name,
      userImage: users.image,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.resourceId, resourceId))
    .orderBy(desc(comments.createdAt));

  return result.map(({ comment, userName, userImage }) => ({
    ...comment,
    userName,
    userImage,
  }));
}

export async function getBookmarkedResourceIds(): Promise<string[]> {
  const dbUser = await getDbUser();
  if (!dbUser) return [];

  const rows = await db
    .select({ resourceId: bookmarks.resourceId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, dbUser.id));

  return rows.map((r) => r.resourceId);
}

export async function getLikedResourceIds(): Promise<string[]> {
  const dbUser = await getDbUser();
  if (!dbUser) return [];

  const rows = await db
    .select({ resourceId: resourceLikes.resourceId })
    .from(resourceLikes)
    .where(eq(resourceLikes.userId, dbUser.id));

  return rows.map((r) => r.resourceId);
}

export async function getSavedResources(): Promise<ResourceWithCategory[]> {
  const dbUser = await getDbUser();
  if (!dbUser) return [];

  const bookmarkRows = await db
    .select({ resourceId: bookmarks.resourceId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, dbUser.id));

  const resourceIds = bookmarkRows.map((r) => r.resourceId);
  if (resourceIds.length === 0) return [];

  const result = await db
    .select({
      resource: resources,
      category: categories,
      creatorName: users.name,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .leftJoin(users, eq(resources.creatorId, users.id))
    .where(inArray(resources.id, resourceIds));

  return result.map(({ resource, category, creatorName }) => ({
    ...resource,
    category,
    creatorName,
  }));
}
