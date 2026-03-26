import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/db";
import { purchases } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  console.log("Webhook hit");
  console.log("Signature:", signature ? "present" : "missing");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { resourceId, userId, pricePaid } = session.metadata ?? {};

    if (!resourceId || !userId || !pricePaid) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const existing = await db.query.purchases.findFirst({
      where: and(
        eq(purchases.userId, userId),
        eq(purchases.resourceId, resourceId),
      ),
    });

    if (!existing) {
      await db.insert(purchases).values({ userId, resourceId, pricePaid });
    }
  }

  return NextResponse.json({ received: true });
}
