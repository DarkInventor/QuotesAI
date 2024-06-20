import { UsernameValidator } from "@/lib/validators/username";
import { getAuthSession } from "../../lib/auth";
import { db } from "../../lib/db";
import { z } from "zod";
import { getUserSubscriptionPlan } from "@/lib/subscription";

export default async function handler(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    // const { name } = UsernameValidator.parse(body);

    // check if username is taken
    // const username = await db.user.findFirst({
    //   where: {
    //     username: name,
    //   },
    // });

    // if (username) {
    //   return new Response("Username is taken", { status: 409 });
    // }

    // update username
    const userSubscription = await getUserSubscriptionPlan(session.user.id);

    if (!userSubscription.isPro) {
      return new Response("Payment required", { status: 402 });
    }
    return new Response("OK");
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not update username at this time. Please try later",
      { status: 500 }
    );
  }
}
