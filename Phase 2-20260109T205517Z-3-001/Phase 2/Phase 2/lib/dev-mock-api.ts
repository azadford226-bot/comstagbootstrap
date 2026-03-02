/**
 * Mock API responses for dev mode
 * Returns fake data so you can test the frontend without backend calls
 */

import {
  isDevMode,
  DEV_MOCK_PROFILE,
  DEV_MOCK_CONSUMER_PROFILE,
} from "./dev-auth";

// Mock data generators
// Use data URIs for images - these work without external requests
const MOCK_PROFILE_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23667eea' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='white'%3EDev%3C/text%3E%3C/svg%3E";
const MOCK_COVER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1200' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='72' fill='white'%3ECover Image%3C/text%3E%3C/svg%3E";

export const mockProfile = {
  ...DEV_MOCK_PROFILE,
  profileImage: MOCK_PROFILE_IMAGE,
  coverImage: MOCK_COVER_IMAGE,
};

export const mockConsumerProfile = {
  ...DEV_MOCK_CONSUMER_PROFILE,
  profileImage: MOCK_PROFILE_IMAGE,
  coverImage: MOCK_COVER_IMAGE,
};

export const mockTestimonialsIWrote = [
  {
    id: "1",
    organizationId: "org-456",
    organizationName: "Amazing Tech Co",
    consumerId: "dev-consumer-456",
    consumerName: "Test Consumer",
    rating: 5,
    comment: "Excellent service, highly recommended!",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    organizationId: "org-789",
    organizationName: "Creative Solutions Inc",
    consumerId: "dev-consumer-456",
    consumerName: "Test Consumer",
    rating: 4,
    comment: "Great work, very professional team.",
    createdAt: "2024-02-01T14:30:00Z",
  },
];

export const mockCapabilities = [
  {
    id: "1",
    title: "Web Development",
    body: "Full-stack web development services",
    hashtags: [1, 2, 3],
    createdAt: "2024-01-01",
    organizationId: "dev-org-123",
  },
  {
    id: "2",
    title: "Cloud Infrastructure",
    body: "AWS and Azure cloud solutions",
    hashtags: [4, 5, 6],
    createdAt: "2024-01-02",
    organizationId: "dev-org-123",
  },
  {
    id: "3",
    title: "Mobile Apps",
    body: "iOS and Android development",
    hashtags: [7, 8, 9],
    createdAt: "2024-01-03",
    organizationId: "dev-org-123",
  },
];

// Use data URIs for certificate images - these work without external requests
const MOCK_CERT_1 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2310b981' width='400' height='300'/%3E%3Ctext x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='36' font-weight='bold' fill='white'%3EISO 9001%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3ECertified%3C/text%3E%3C/svg%3E";
const MOCK_CERT_2 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f59e0b' width='400' height='300'/%3E%3Ctext x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='36' font-weight='bold' fill='white'%3EAWS%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3ECertified%3C/text%3E%3C/svg%3E";

export const mockCertificates = [
  {
    id: "1",
    image: {
      id: MOCK_CERT_1,
      mediaType: "IMAGE",
    },
    imageId: MOCK_CERT_1,
    imageUrl: MOCK_CERT_1,
    title: "ISO 9001 Certified",
    body: "Quality management certification",
    link: "https://example.com/cert",
    certificateDate: "2023-01-01",
    createdAt: "2023-01-01",
    organizationId: "dev-org-123",
  },
  {
    id: "2",
    image: {
      id: MOCK_CERT_2,
      mediaType: "IMAGE",
    },
    imageId: MOCK_CERT_2,
    imageUrl: MOCK_CERT_2,
    title: "AWS Certified",
    body: "Amazon Web Services certification",
    link: "",
    certificateDate: "2023-06-15",
    createdAt: "2023-06-15",
    organizationId: "dev-org-123",
  },
];

export const mockSuccessStories = [
  {
    id: "1",
    title: "E-commerce Platform Launch",
    body: "Successfully launched a scalable e-commerce platform handling 10,000+ daily transactions. Our team worked closely with the client to understand their requirements and delivered a solution that exceeded expectations. The platform now processes thousands of orders daily with 99.9% uptime.",
    mediaIds: [MOCK_CERT_1, MOCK_CERT_2],
    hashtags: [1, 2],
    createdAt: "2024-01-15",
    organizationId: "dev-org-123",
  },
  {
    id: "2",
    title: "Mobile App Deployment",
    body: "Deployed mobile app reaching 50,000 downloads in the first month. The app features a user-friendly interface, real-time notifications, and seamless payment integration. Client satisfaction increased by 40% after launch.",
    mediaIds: [MOCK_CERT_1],
    hashtags: [3, 4],
    createdAt: "2024-03-20",
    organizationId: "dev-org-123",
  },
];

export const mockEvents = [
  {
    id: "event-1",
    title: "Web Development Workshop",
    description:
      "Learn modern web development with React, Next.js, and TypeScript. Hands-on workshop for beginners and intermediate developers.",
    startDate: "2025-01-15",
    endDate: "2025-01-15",
    startAt: "2025-01-15T10:00:00Z",
    endAt: "2025-01-15T17:00:00Z",
    location: "San Francisco, CA",
    online: false,
    isRegistered: false,
    createdAt: "2024-12-01T10:00:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
  {
    id: "event-2",
    title: "AI & Machine Learning Summit 2025",
    description:
      "Join us for a comprehensive summit on artificial intelligence and machine learning. Network with industry leaders and explore cutting-edge technologies.",
    startDate: "2025-02-20",
    endDate: "2025-02-22",
    startAt: "2025-02-20T09:00:00Z",
    endAt: "2025-02-22T18:00:00Z",
    location: "New York, NY",
    online: false,
    isRegistered: false,
    createdAt: "2024-11-15T14:30:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
  {
    id: "event-3",
    title: "Cloud Computing Webinar",
    description:
      "Virtual webinar covering AWS, Azure, and Google Cloud Platform. Learn cloud architecture best practices from experts.",
    startDate: "2025-01-08",
    endDate: "2025-01-08",
    startAt: "2025-01-08T14:00:00Z",
    endAt: "2025-01-08T16:00:00Z",
    location: "Online",
    online: true,
    isRegistered: false,
    createdAt: "2024-12-10T09:00:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
  {
    id: "event-4",
    title: "Mobile App Development Bootcamp",
    description:
      "Intensive 3-day bootcamp covering iOS and Android development. Build your first mobile app from scratch.",
    startDate: "2025-03-10",
    endDate: "2025-03-12",
    startAt: "2025-03-10T09:00:00Z",
    endAt: "2025-03-12T17:00:00Z",
    location: "Austin, TX",
    online: false,
    isRegistered: false,
    createdAt: "2024-12-05T11:30:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
  {
    id: "event-5",
    title: "Cybersecurity Best Practices",
    description:
      "Learn essential cybersecurity practices to protect your organization. Covers threat detection, prevention, and response strategies.",
    startDate: "2025-01-25",
    endDate: "2025-01-25",
    startAt: "2025-01-25T13:00:00Z",
    endAt: "2025-01-25T16:00:00Z",
    location: "Online",
    online: true,
    isRegistered: false,
    createdAt: "2024-12-08T15:45:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
];

// Mock registered events (subset of mockEvents with isRegistered: true)
export const mockMyEventRegistrations = [
  {
    ...mockEvents[0], // Web Development Workshop
    isRegistered: true,
  },
  {
    ...mockEvents[2], // Cloud Computing Webinar
    isRegistered: true,
  },
];

export const mockPosts = [
  {
    id: "post-1",
    title: "Announcing Our New Product Launch",
    body: "We're excited to announce the launch of our latest product! This revolutionary solution will transform how businesses operate in the digital age. Stay tuned for more updates.",
    mediaIds: [MOCK_CERT_1],
    hashtags: [1, 2, 3],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
  {
    id: "post-2",
    title: "Behind the Scenes: Our Development Process",
    body: "Ever wondered how we build amazing products? In this post, we take you behind the scenes to show our development process, from ideation to deployment. Check it out!",
    mediaIds: [MOCK_CERT_2],
    hashtags: [4, 5],
    createdAt: "2024-11-25T14:30:00Z",
    updatedAt: "2024-11-25T14:30:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
  {
    id: "post-3",
    title: "Industry Trends and Insights for 2025",
    body: "As we approach 2025, here are the top technology trends we're watching. From AI to cloud computing, these innovations will shape the future of our industry.",
    mediaIds: [],
    hashtags: [6, 7, 8],
    createdAt: "2024-11-20T09:15:00Z",
    updatedAt: "2024-11-20T09:15:00Z",
    organizationId: "dev-org-123",
    organizationName: "Test Organization",
  },
];

export const mockTestimonials = [
  {
    id: "1",
    organizationId: "dev-org-123",
    organizationName: "Dev Test Organization",
    consumerId: "consumer-1",
    consumerName: "John Smith",
    rating: 5,
    comment:
      "Excellent service! The team was professional and delivered beyond our expectations. Highly recommended for anyone looking for quality work.",
    createdAt: "2024-11-01T10:00:00Z",
  },
  {
    id: "2",
    organizationId: "dev-org-123",
    organizationName: "Dev Test Organization",
    consumerId: "consumer-2",
    consumerName: "Sarah Johnson",
    rating: 4,
    comment:
      "Great experience working with this organization. Communication was clear and timely throughout the project.",
    createdAt: "2024-11-15T14:30:00Z",
  },
  {
    id: "3",
    organizationId: "dev-org-123",
    organizationName: "Dev Test Organization",
    consumerId: "consumer-3",
    consumerName: "Michael Chen",
    rating: 5,
    comment:
      "Outstanding quality and attention to detail. Will definitely work with them again on future projects.",
    createdAt: "2024-12-01T09:15:00Z",
  },
];

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Intercept API response and return mock data in dev mode
 */
export function mockApiResponse<T>(
  realApiCall: () => Promise<ApiResponse<T>>,
  mockData: T
): Promise<ApiResponse<T>> {
  if (!isDevMode()) {
    return realApiCall();
  }

  // Return mock data wrapped in the expected API response format
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 [DEV MODE] Returning mock data instead of API call");
  }
  return Promise.resolve({
    success: true,
    data: mockData,
  });
}

/**
 * List response with pagination
 */
interface ListApiResponse<T> {
  success: boolean;
  data: T[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

/**
 * Mock list response (with pagination info)
 */
export function mockApiListResponse<T>(
  realApiCall: () => Promise<ListApiResponse<T>>,
  mockItems: T[]
): Promise<ListApiResponse<T>> {
  if (!isDevMode()) {
    return realApiCall();
  }

  if (process.env.NODE_ENV === "development") {
    console.log("🔧 [DEV MODE] Returning mock list data");
  }
  return Promise.resolve({
    success: true,
    data: mockItems,
    totalCount: mockItems.length,
    page: 1,
    pageSize: mockItems.length,
  });
}
