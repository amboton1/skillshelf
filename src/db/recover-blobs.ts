import { list } from "@vercel/blob";
import { eq } from "drizzle-orm";
import db from "@/db";
import { resourceFiles, resources, users } from "@/db/schema";

// ─── Configure before running ───────────────────────────────────────────────
// 1. Log into the app in your browser so Stack Auth recreates your user row.
// 2. Set your account email here, then run: npx tsx src/db/recover-blobs.ts
const CREATOR_EMAIL = "@gmail.com";
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Find creator
  const creator = await db.query.users.findFirst({
    where: eq(users.email, CREATOR_EMAIL),
  });
  if (!creator) {
    throw new Error(
      `No user found with email "${CREATOR_EMAIL}".\n` +
        "Make sure you have logged into the app at least once so Stack Auth can recreate your account.",
    );
  }
  console.log(`✓ Found user: ${creator.name ?? creator.email} (${creator.id})`);

  // 2. List all blobs uploaded to the documents/ prefix
  const { blobs } = await list({ prefix: "documents/" });
  if (blobs.length === 0) {
    console.log("No blobs found under documents/ — nothing to restore.");
    return;
  }
  console.log(`Found ${blobs.length} blob(s). Restoring...\n`);

  // 3. Restore each blob as a resource
  for (const blob of blobs) {
    // Extract the original filename from the blob path
    // Blob paths look like: documents/1234567890-original-name.pdf
    const pathSegment = blob.pathname.split("/").pop() ?? blob.pathname;
    // Strip the leading timestamp prefix
    const originalFileName = pathSegment.replace(/^\d+-/, "");
    // Derive a human-readable title from the filename (strip extension, clean separators)
    const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
    const title = nameWithoutExt || originalFileName;
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    const [resource] = await db
      .insert(resources)
      .values({
        title,
        slug,
        description: "",
        price: "0",
        published: true,
        creatorId: creator.id,
      })
      .returning();

    await db.insert(resourceFiles).values({
      resourceId: resource.id,
      fileUrl: blob.url,
      fileName: originalFileName,
    });

    console.log(`✓ Restored: "${title}"`);
    console.log(`  File: ${originalFileName}`);
    console.log(`  URL:  ${blob.url}\n`);
  }

  console.log(
    "Done! Go to your dashboard to update titles, descriptions, prices, and categories.",
  );
}

void main().catch((err) => {
  console.error("Recovery failed:", err);
  process.exit(1);
});
