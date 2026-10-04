"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAdmin(prevState: unknown, formData: FormData) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: true,
      redirectTo: "/waitlist", // Redirects to admin.soldbay.shop/waitlist because of subdomain
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Re-throw Next.js redirect errors or other unknown errors
  }
}
