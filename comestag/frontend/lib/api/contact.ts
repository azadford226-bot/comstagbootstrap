import { logger } from "@/lib/logger";
import { CONTACT_ENDPOINTS } from "./endpoints";

export interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_USE_PROXY === "true") return "/api/proxy";
  if (typeof window !== "undefined" && window.location?.hostname?.includes("vercel.app")) {
    return "/api/proxy";
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
}
const API_BASE_URL = getApiBaseUrl();

/**
 * Submit contact form (no authentication required)
 */
export async function submitContactForm(
  data: ContactFormRequest
): Promise<{ success: boolean; message?: string; status?: number }> {
  try {
    logger.info("Submitting contact form", { email: data.email, subject: data.subject });
    
    const response = await fetch(`${API_BASE_URL}${CONTACT_ENDPOINTS.SUBMIT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return {
        success: true,
        message: "Thank you for contacting us! We'll get back to you soon.",
      };
    }
    
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      message: errorData.message || "Failed to submit contact form",
      status: response.status,
    };
  } catch (error) {
    logger.error("Error submitting contact form", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit contact form",
    };
  }
}
