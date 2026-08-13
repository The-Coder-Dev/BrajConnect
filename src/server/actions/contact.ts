"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { enforceRateLimit, getClientIdentifier } from "@/lib/security/rate-limit";
import { getFriendlyErrorMessage } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  category: z.enum(["general", "business_support", "partnership", "feedback", "other"]).default("general"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000, "Message cannot exceed 3000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitContactMessage(data: unknown): Promise<ContactResponse> {
  try {
    // 1. Rate Limiting via IP / User Identifier
    const incomingHeaders = await headers();
    const mockRequest = new Request("http://localhost/contact", {
      headers: incomingHeaders,
    });
    const identifier = getClientIdentifier(mockRequest);

    const rateLimit = await enforceRateLimit({
      identifier,
      category: "contact",
    });

    if (!rateLimit.success) {
      return {
        success: false,
        error: rateLimit.error || "Too many contact submissions. Please wait a minute before trying again.",
      };
    }

    // 2. Validate input schema
    const result = contactFormSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: "Please check your inputs and correct the errors below.",
        fieldErrors: result.error.flatten().fieldErrors,
      };
    }

    const { name, email, phone, category, subject, message } = result.data;

    // 3. Log submission securely (isolated handler ready for SMTP/Resend transport)
    console.log(`[Contact Submission] Received from ${name} <${email}>:`, {
      category,
      subject,
      phone: phone || "Not provided",
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // In a production setup with email credentials or database, messages can be dispatched here.
    // For example: await sendEmail({ to: "support@bachatlal.com", ... })

    return {
      success: true,
      message: "Thank you for reaching out! We have received your message and our team will get back to you within 24 business hours.",
    };
  } catch (error) {
    console.error("[Contact Submission] Unexpected error occurred:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "An unexpected error occurred. Please try again later or reach out via email directly."),
    };
  }
}
