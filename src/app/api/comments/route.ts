import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db";
import { comments, users } from "@/db/schema";
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

  const { resourceId, description } = await request.json();
  if (!resourceId || !description?.trim()) {
    return NextResponse.json(
      { error: "resourceId and description are required" },
      { status: 400 },
    );
  }

  const [inserted] = await db
    .insert(comments)
    .values({ userId: dbUser.id, resourceId, description: description.trim() })
    .returning();

  return NextResponse.json({
    ...inserted,
    userName: dbUser.name,
    userImage: dbUser.image,
  });
}
