import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2024-04-10',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Handler called");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (req.headers["stripe-signature"]) {
    console.log("Stripe signature found");

    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let stripeEvent: Stripe.Event;

    try {
      stripeEvent = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
      console.log("Stripe event constructed:", stripeEvent);
    } catch (err) {
      const error = err as Error;
      console.error("⚠️ Webhook signature verification failed.", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log(`Handling Stripe event type: ${stripeEvent.type}`);
    switch (stripeEvent.type) {
      case "checkout.session.completed":
        console.log("Handling checkout.session.completed");
        await handleCheckoutSessionCompleted(stripeEvent, req, res);
        break;

      case "invoice.payment_succeeded":
        console.log("Handling invoice.payment_succeeded");
        await handleInvoicePaymentSucceeded(stripeEvent, req, res);
        break;

      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return res.status(200).json({ received: true });
  } else {
    console.log("No Stripe signature, handling checkout creation");
    try {
      await handleCheckoutCreation(req, res);
    } catch (error) {
      console.error("⚠️ StripeSignatureVerificationError: No webhook payload was provided.", error);
      return res.status(400).send("StripeSignatureVerificationError: No webhook payload was provided.");
    }
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event, req: NextApiRequest, res: NextApiResponse) {
  const stripeSession = event.data.object as Stripe.Checkout.Session;

  console.log("Stripe session:", stripeSession);

  if (!stripeSession.subscription || !stripeSession.customer_email) {
    console.error("Stripe session data is incomplete.");
    return;
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      console.error("Failed to retrieve server session.");
      return;
    }

    console.log("Server session:", session);

    const subscription = await stripe.subscriptions.retrieve(stripeSession.subscription as string);
    console.log("Retrieved subscription:", subscription);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.error("User not found for ID:", session.user.id);
      return;
    }

    console.log("User found:", user);

    await db.user.update({
      where: { id: session.user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        hasPaid: true,
      },
    });

    console.log("Updated user with subscription details");
  } catch (error) {
    console.error("Failed to update user with subscription details:", (error as Error).message);
  }
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event, req: NextApiRequest, res: NextApiResponse) {
  const invoice = event.data.object as Stripe.Invoice;

  console.log("Invoice:", invoice);

  try {
    const subscriptionId = invoice.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      console.error("Failed to retrieve server session.");
      return;
    }

    console.log("Server session:", session);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.error("User not found for ID:", session.user.id);
      return;
    }

    console.log("User found:", user);

    await db.user.update({
      where: { id: session.user.id },
      data: {
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    console.log("Updated user with new subscription period end date");
  } catch (error) {
    console.error("Failed to update user with new subscription period end date:", (error as Error).message);
  }
}

async function handleCheckoutCreation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Server session:", session);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1PS6GtAPpzV89AesFYQwxtij",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/canceled`,
    });

    console.log("Checkout session created:", checkoutSession);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (user && user.hasPaid) {
      console.log("User has already paid.");
    } else {
      await db.user.update({
        where: { id: session.user.id },
        data: {    
          hasPaid: true,
        },
      });
      console.log("User payment status updated to true.");
    }


    console.log("User found:", user);
    // const invoice = event.data.object as Stripe.Invoice;

    // const subscriptionId = invoice.subscription as string;
    // const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // const session = await getAuthSession(req, res);
    if (!session || !session.user || !session.user.id) {
      console.error("Failed to retrieve server session.");
      return;
    }

    console.log("Server session:", session);

    

    res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    const error = err as Error;
    console.error("Stripe error:", error.message);
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}
