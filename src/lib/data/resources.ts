import db from "@/db";
import { categories, resources, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stackServerApp } from "@/stack/server";

export type ResourceWithCategory = typeof resources.$inferSelect & {
  category: typeof categories.$inferSelect | null;
};

export async function getResources(): Promise<ResourceWithCategory[]> {
  const result = await db
    .select({
      resource: resources,
      category: categories,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id));

  return result.map(({ resource, category }) => ({
    ...resource,
    category,
  }));
}

export async function getUsersResources(): Promise<ResourceWithCategory[]> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return [];
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) {
    return [];
  }

  const result = await db
    .select({
      resource: resources,
      category: categories,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .where(eq(resources.creatorId, dbUser.id));

  return result.map(({ resource, category }) => ({
    ...resource,
    category,
  }));
}

export async function getResourceByID(id: string) {
  const [resource] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id));

  return resource;
}
