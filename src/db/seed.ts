import { seed } from "drizzle-seed";
import db, { sql } from "@/db";
import {
  categories,
  comments,
  emailLogs,
  purchases,
  resourceFiles,
  resourceLikes,
  resources,
  reviews,
  users,
} from "@/db/schema";

const SEED = 1337;
const USER_COUNT = 8;
const RESOURCE_COUNT = 24;
const PURCHASE_COUNT = 18;
const REVIEW_COUNT = 16;
const LIKE_COUNT = 20;
const COMMENT_COUNT = 30;
const EMAIL_LOG_COUNT = 10;

const categoryData = [
  { name: "UI Kits", slug: "ui-kits" },
  { name: "Templates", slug: "templates" },
  { name: "E-books", slug: "e-books" },
  { name: "Icons", slug: "icons" },
  { name: "Courses", slug: "courses" },
  { name: "Code Snippets", slug: "code-snippets" },
];

async function main() {
  try {
    console.log(`🌱 Starting database seed with seed ${SEED}...`);

    console.log("🧹 Truncating tables...");
    await sql`TRUNCATE TABLE email_logs, comments, resource_likes, reviews, purchases, resource_files, resources, categories, users RESTART IDENTITY CASCADE;`;

    console.log("👤 Seeding users...");
    await seed(db, { users }, { seed: SEED }).refine((funcs) => ({
      users: {
        count: USER_COUNT,
        columns: {
          name: funcs.fullName(),
          email: funcs.email(),
          image: funcs.default({ defaultValue: null }),
          role: funcs.valuesFromArray({
            values: ["user", "user", "user", "admin"],
            isUnique: false,
          }),
        },
      },
    }));

    const insertedUsers = await db.select({ id: users.id }).from(users);
    const userIds = insertedUsers.map((user) => user.id);

    console.log("🗂️ Seeding categories...");
    await db.insert(categories).values(categoryData);

    const insertedCategories = await db
      .select({ id: categories.id })
      .from(categories);
    const categoryIds = insertedCategories.map((category) => category.id);

    console.log("📦 Seeding resources...");
    await seed(db, { resources }, { seed: SEED + 1 }).refine((funcs) => ({
      resources: {
        count: RESOURCE_COUNT,
        columns: {
          title: funcs.valuesFromArray({
            values: [
              "Ultimate SaaS Landing Page Kit",
              "Notion Creator Workspace",
              "Indie Hacker Pitch Deck",
              "Minimal Resume Template",
              "React Component Playbook",
              "Freelancer Client Portal UI",
              "Digital Product Launch Guide",
              "Icon Pack for Startups",
            ],
            isUnique: false,
          }),
          slug: funcs.string({ isUnique: true }),
          description: funcs.valuesFromArray({
            values: [
              "A polished digital resource designed to help creators launch faster with less setup friction.",
              "A practical bundle with reusable assets, editable structure, and production-ready organization.",
              "Built for makers who want a clean starting point for premium products and client-ready deliverables.",
              "Includes thoughtful details, clear documentation, and flexible files for quick customization.",
            ],
            isUnique: false,
          }),
          price: funcs.valuesFromArray({
            values: ["0.00", "9.00", "19.00", "29.00", "49.00", "79.00"],
            isUnique: false,
          }),
          thumbnail: funcs.valuesFromArray({
            values: [
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
            ],
            isUnique: false,
          }),
          published: funcs.default({ defaultValue: true }),
          creatorId: funcs.valuesFromArray({
            values: userIds,
            isUnique: false,
          }),
          categoryId: funcs.valuesFromArray({
            values: categoryIds,
            isUnique: false,
          }),
        },
      },
    }));

    const insertedResources = await db
      .select({ id: resources.id, price: resources.price })
      .from(resources);
    const resourceIds = insertedResources.map((resource) => resource.id);

    console.log("📁 Seeding resource files...");
    await seed(db, { resourceFiles }, { seed: SEED + 2 }).refine((funcs) => ({
      resourceFiles: {
        count: RESOURCE_COUNT,
        columns: {
          resourceId: funcs.valuesFromArray({
            values: resourceIds,
            isUnique: true,
          }),
          fileUrl: funcs.valuesFromArray({
            values: [
              "https://example.com/files/skillshelf-resource.zip",
              "https://example.com/files/creator-kit.pdf",
              "https://example.com/files/ui-library.fig",
              "https://example.com/files/course-materials.zip",
            ],
            isUnique: false,
          }),
          fileName: funcs.valuesFromArray({
            values: [
              "resource-bundle.zip",
              "playbook.pdf",
              "design-system.fig",
              "starter-pack.zip",
            ],
            isUnique: false,
          }),
        },
      },
    }));

    console.log("🛒 Seeding purchases...");
    await seed(db, { purchases }, { seed: SEED + 3 }).refine((funcs) => ({
      purchases: {
        count: PURCHASE_COUNT,
        columns: {
          userId: funcs.valuesFromArray({ values: userIds, isUnique: false }),
          resourceId: funcs.valuesFromArray({
            values: resourceIds,
            isUnique: false,
          }),
          pricePaid: funcs.valuesFromArray({
            values: insertedResources.map((resource) =>
              resource.price.toString(),
            ),
            isUnique: false,
          }),
        },
      },
    }));

    console.log("⭐ Seeding reviews...");
    await seed(db, { reviews }, { seed: SEED + 4 }).refine((funcs) => ({
      reviews: {
        count: REVIEW_COUNT,
        columns: {
          userId: funcs.valuesFromArray({ values: userIds, isUnique: false }),
          resourceId: funcs.valuesFromArray({
            values: resourceIds,
            isUnique: false,
          }),
          rating: funcs.int({ minValue: 3, maxValue: 5 }),
          comment: funcs.valuesFromArray({
            values: [
              "Super useful and easy to customize.",
              "Great structure, clean design, and saved me a lot of time.",
              "Exactly what I needed to ship faster.",
              "Very solid starting point with thoughtful details.",
            ],
            isUnique: false,
          }),
        },
      },
    }));

    console.log("❤️ Seeding resource likes...");
    await seed(db, { resourceLikes }, { seed: SEED + 5 }).refine((funcs) => ({
      resourceLikes: {
        count: LIKE_COUNT,
        columns: {
          userId: funcs.valuesFromArray({ values: userIds, isUnique: false }),
          resourceId: funcs.valuesFromArray({
            values: resourceIds,
            isUnique: false,
          }),
        },
      },
    }));

    console.log("💬 Seeding comments...");
    await seed(db, { comments }, { seed: SEED + 7 }).refine((funcs) => ({
      comments: {
        count: COMMENT_COUNT,
        columns: {
          userId: funcs.valuesFromArray({ values: userIds, isUnique: false }),
          resourceId: funcs.valuesFromArray({
            values: resourceIds,
            isUnique: false,
          }),
          description: funcs.valuesFromArray({
            values: [
              "This is exactly what I was looking for. Saved me hours of work!",
              "Really clean and well-organized. Would definitely recommend.",
              "Great resource, used it for a client project and they loved it.",
              "The structure is solid. Easy to customize to fit my brand.",
              "Honestly one of the better resources I've picked up. Well worth it.",
              "Does what it says on the tin. No fluff, just useful stuff.",
              "I've used a lot of similar products — this one stands out.",
              "Super easy to get started with. The documentation is clear.",
              "Picked this up for a side project and it made a huge difference.",
              "Clean design and thoughtful details. Shipping this to a client next week.",
            ],
            isUnique: false,
          }),
        },
      },
    }));

    console.log("📨 Seeding email logs...");
    await seed(db, { emailLogs }, { seed: SEED + 6 }).refine((funcs) => ({
      emailLogs: {
        count: EMAIL_LOG_COUNT,
        columns: {
          userId: funcs.valuesFromArray({ values: userIds, isUnique: false }),
          type: funcs.valuesFromArray({
            values: [
              "welcome",
              "purchase_receipt",
              "resource_update",
              "creator_digest",
            ],
            isUnique: false,
          }),
          status: funcs.valuesFromArray({
            values: ["sent", "sent", "queued", "failed"],
            isUnique: false,
          }),
        },
      },
    }));

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("💥 Seed failed:", error);
    process.exit(1);
  }
}

void main();
