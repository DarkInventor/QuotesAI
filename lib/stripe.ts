import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
  apiVersion: "2023-08-16", // Adjusted to the correct available version as per the followup instructions
  typescript: true,
})