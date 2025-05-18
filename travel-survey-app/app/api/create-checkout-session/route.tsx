import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51R0kOcB9agy1awEb3ERZEpBxYmb5RUj8FesZIBpbtHhsvhd2t9gWYQ9wdY3bsNEQwBf15Ls8fVdGAp8gPzbiAU6Y00MHdiQrS7");

export async function POST(request: Request) {
  try {
    const { packageId, packageName, packagePrice, city } = await request.json();

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${packageName} - ${city}`,
              metadata: {
                packageId,
                city,
              },
            },
            unit_amount: packagePrice, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/${city}`,
      metadata: {
        packageId,
        city,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}