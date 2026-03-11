import db from "@/db";
import { categories, resources } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getCategories() {
  return await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      createdAt: categories.createdAt,
      resources: sql<number>`COUNT(${resources.id})`.as("resources"),
    })
    .from(categories)
    .leftJoin(resources, sql`${resources.categoryId} = ${categories.id}`)
    .groupBy(
      categories.id,
      categories.name,
      categories.slug,
      categories.createdAt,
    );
}
