import "server-only";

import { eq } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack/server";

export async function syncUser() {
  const user = await stackServerApp.getUser();

  if (!user?.primaryEmail) {
    return null;
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!existingUser) {
    const userData = {
      stackId: user.id,
      email: user.primaryEmail,
      ...(user.displayName ? { name: user.displayName } : {}),
      ...(user.profileImageUrl ? { image: user.profileImageUrl } : {}),
    };

    await db.insert(users).values({
      ...userData,
    });
  }

  return user;
}
