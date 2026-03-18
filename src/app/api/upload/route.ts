import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import db from "@/db";
import { emailLogs, resourceFiles, resources, users } from "@/db/schema";
import { sendResourceUploadedEmail } from "@/email";
import { stackServerApp } from "@/stack/server";

export async function POST(request: Request) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, stackUser.id),
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const categoryId = (formData.get("categoryId") as string) || null;

  const uploaded = await put(`documents/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  const title = nameWithoutExt || file.name;
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
      creatorId: dbUser.id,
      categoryId,
    })
    .returning();

  await db.insert(resourceFiles).values({
    resourceId: resource.id,
    fileUrl: uploaded.url,
    fileName: file.name,
  });

  const emailResult = await sendResourceUploadedEmail({
    to: dbUser.email,
    userName: dbUser.name,
    resourceTitle: resource.title,
    resourceSlug: resource.slug,
  }).catch(() => null);

  await db.insert(emailLogs).values({
    userId: dbUser.id,
    type: "resource_uploaded",
    status: emailResult?.error ? "failed" : "sent",
  });

  revalidatePath("/dashboard");
  return NextResponse.json({ url: uploaded.url, resource });
}
