import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/db";
import { resources, users } from "@/db/schema";
import { stackServerApp } from "@/stack/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

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

  const { resourceId, slug } = await request.json();
  if (!resourceId || !slug) {
    return NextResponse.json(
      { error: "resourceId and slug required" },
      { status: 400 },
    );
  }

  const [resource] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, resourceId));
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const priceInCents = Math.round(parseFloat(resource.price) * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: priceInCents,
          product_data: {
            name: resource.title,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      resourceId,
      userId: dbUser.id,
      pricePaid: resource.price,
    },
    success_url: `${origin}/library/${slug}?success=true`,
    cancel_url: `${origin}/library/${slug}`,
  });

  return NextResponse.json({ url: session.url });
}
