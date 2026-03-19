import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db";
import { resourceLikes, users } from "@/db/schema";
import { stackServerApp } from "@/stack/server";

export async function POST(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { resourceId } = await request.json();
  if (!resourceId) {
    return NextResponse.json({ error: "resourceId required" }, { status: 400 });
  }

  const existing = await db.query.resourceLikes.findFirst({
    where: and(
      eq(resourceLikes.userId, dbUser.id),
      eq(resourceLikes.resourceId, resourceId),
    ),
  });

  if (existing) {
    await db
      .delete(resourceLikes)
      .where(
        and(
          eq(resourceLikes.userId, dbUser.id),
          eq(resourceLikes.resourceId, resourceId),
        ),
      );
    return NextResponse.json({ liked: false });
  }

  await db.insert(resourceLikes).values({ userId: dbUser.id, resourceId });
  return NextResponse.json({ liked: true });
}
