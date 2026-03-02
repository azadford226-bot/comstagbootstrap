import { authenticatedGet, authenticatedPost } from "./api-client";
import { logger } from "@/lib/logger";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" ? "" : "http://localhost:3000");

const ADMIN_ENDPOINTS = {
  STATS: "/v1/admin/stats",
  ORGANIZATIONS: "/v1/admin/organizations",
  PENDING_ORGANIZATIONS: "/v1/admin/organizations/pending",
  APPROVE_ORGANIZATION: (orgId: string) => `/v1/admin/organizations/${orgId}/approve`,
  CONTACT_MESSAGES: "/v1/admin/contact-messages",
  MARK_CONTACT_READ: (messageId: string) => `/v1/admin/contact-messages/${messageId}/read`,
  CONVERSATIONS: "/v1/admin/conversations",
};

export interface AdminStats {
  totalOrganizations: number;
  totalConsumers: number;
  totalAdmins: number;
  pendingOrganizations: number;
  totalContactMessages: number;
  unreadContactMessages: number;
  totalConversations: number;
}

export interface Organization {
  id: string;
  displayName: string;
  website: string;
  industry: { id: number; name: string };
  established: string;
  size: string;
  approved: boolean;
  whoWeAre?: string;
  whatWeDo?: string;
  country?: string;
  state?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  lastMessageId?: string;
  lastMessageTime?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminStats(): Promise<AdminStats | null> {
  try {
    const response = await authenticatedGet<AdminStats>(
      `${API_BASE_URL}${ADMIN_ENDPOINTS.STATS}`
    );
    return response.success && response.data ? response.data : null;
  } catch (error) {
    logger.error("Failed to fetch admin stats", error);
    return null;
  }
}

export async function listOrganizations(page: number = 0): Promise<{
  content: Organization[];
  totalElements: number;
  totalPages: number;
}> {
  try {
    const response = await authenticatedGet<{
      content: Organization[];
      totalElements: number;
      totalPages: number;
    }>(`${API_BASE_URL}${ADMIN_ENDPOINTS.ORGANIZATIONS}?page=${page}`);
    return response.success && response.data 
      ? response.data 
      : { content: [], totalElements: 0, totalPages: 0 };
  } catch (error) {
    logger.error("Failed to list organizations", error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
}

export async function listPendingOrganizations(page: number = 0): Promise<{
  content: Organization[];
  totalElements: number;
  totalPages: number;
}> {
  try {
    const response = await authenticatedGet<{
      content: Organization[];
      totalElements: number;
      totalPages: number;
    }>(`${API_BASE_URL}${ADMIN_ENDPOINTS.PENDING_ORGANIZATIONS}?page=${page}`);
    return response.success && response.data 
      ? response.data 
      : { content: [], totalElements: 0, totalPages: 0 };
  } catch (error) {
    logger.error("Failed to list pending organizations", error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
}

export async function approveOrganization(orgId: string): Promise<boolean> {
  try {
    await authenticatedPost(
      `${API_BASE_URL}${ADMIN_ENDPOINTS.APPROVE_ORGANIZATION(orgId)}`,
      {}
    );
    return true;
  } catch (error) {
    logger.error("Failed to approve organization", error);
    return false;
  }
}

export async function listContactMessages(
  page: number = 0,
  unreadOnly: boolean = false
): Promise<{
  content: ContactMessage[];
  totalElements: number;
  totalPages: number;
}> {
  try {
    const response = await authenticatedGet<{
      content: ContactMessage[];
      totalElements: number;
      totalPages: number;
    }>(
      `${API_BASE_URL}${ADMIN_ENDPOINTS.CONTACT_MESSAGES}?page=${page}&unreadOnly=${unreadOnly}`
    );
    return response.success && response.data 
      ? response.data 
      : { content: [], totalElements: 0, totalPages: 0 };
  } catch (error) {
    logger.error("Failed to list contact messages", error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
}

export async function markContactMessageRead(messageId: string): Promise<boolean> {
  try {
    await authenticatedPost(
      `${API_BASE_URL}${ADMIN_ENDPOINTS.MARK_CONTACT_READ(messageId)}`,
      {}
    );
    return true;
  } catch (error) {
    logger.error("Failed to mark contact message as read", error);
    return false;
  }
}

export async function listAllConversations(page: number = 0): Promise<{
  content: Conversation[];
  totalElements: number;
  totalPages: number;
}> {
  try {
    const response = await authenticatedGet<{
      content: Conversation[];
      totalElements: number;
      totalPages: number;
    }>(`${API_BASE_URL}${ADMIN_ENDPOINTS.CONVERSATIONS}?page=${page}`);
    return response.success && response.data 
      ? response.data 
      : { content: [], totalElements: 0, totalPages: 0 };
  } catch (error) {
    logger.error("Failed to list conversations", error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
}
