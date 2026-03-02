import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const API_BASE_URL = "https://comstag-back.onrender.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${API_BASE_URL}/${pathString}${
    searchParams ? `?${searchParams}` : ""
  }`;

  try {
    logger.api("GET", url);

    const headers: HeadersInit = {};

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    logger.debug("Proxy GET response received", { status: response.status });

    const contentType = response.headers.get("content-type");

    // For media files (images, videos, etc.), return the binary data directly
    if (contentType && (contentType.startsWith("image/") || contentType.startsWith("video/") || contentType.startsWith("audio/"))) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // For JSON responses
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // For other responses
    const text = await response.text();
    const data = text ? { message: text } : {};
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error("Proxy GET error", error, { url });
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  await params;

  // Reconstruct the full path from the original request to preserve trailing slashes
  let fullPath = request.nextUrl.pathname.replace("/api/proxy/", "");
  const searchParams = request.nextUrl.searchParams.toString();

  // Add trailing slash for retry-verification endpoint
  if (fullPath === "v1/auth/retry-verification") {
    fullPath = "v1/auth/retry-verification/";
  }

  const url = `${API_BASE_URL}/${fullPath}${
    searchParams ? `?${searchParams}` : ""
  }`;

  logger.debug("Proxy POST request", {
    url,
    fullPath,
    hasSearchParams: !!searchParams,
  });

  try {
    const contentType = request.headers.get("content-type");
    const isFormData = contentType?.includes("multipart/form-data");

    logger.api("POST", url, { isFormData });

    const headers: HeadersInit = {
      accept: "*/*",
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
    };

    if (isFormData) {
      // For file uploads, pass FormData directly without setting Content-Type
      // The browser will set it automatically with the correct boundary
      fetchOptions.body = await request.arrayBuffer();
      if (contentType) {
        headers["Content-Type"] = contentType;
      }
    } else {
      // For JSON requests
      let body = {};
      let hasBody = false;
      try {
        const text = await request.text();
        if (text) {
          body = JSON.parse(text);
          hasBody = true;
        }
      } catch {
        logger.debug("No request body in POST");
      }

      if (hasBody) {
        headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = "";
      }
    }

    fetchOptions.headers = headers;

    const response = await fetch(url, fetchOptions);

    logger.debug("Proxy POST response received", { status: response.status });

    let data;
    const responseContentType = response.headers.get("content-type");

    try {
      if (
        responseContentType &&
        responseContentType.includes("application/json")
      ) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        const text = await response.text();
        data = text ? { message: text } : {};
      }
    } catch {
      logger.debug("Response body is empty or invalid JSON");
      data = {};
    }

    logger.debug("Proxy POST response data", { hasData: !!data });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error("Proxy POST error", error, { url });
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${API_BASE_URL}/${pathString}${
    searchParams ? `?${searchParams}` : ""
  }`;

  try {
    let body = {};
    let hasBody = false;
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
        hasBody = true;
      }
    } catch {
      logger.debug("No request body in PUT");
    }

    logger.api("PUT", url, { hasBody });

    const headers: HeadersInit = {};

    // Only set Content-Type if there's a body
    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
    });

    logger.debug("Proxy PUT response received", { status: response.status });

    let data;
    const contentType = response.headers.get("content-type");

    try {
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        const text = await response.text();
        data = text ? { message: text } : {};
      }
    } catch {
      logger.debug("Response body is empty or invalid JSON");
      data = {};
    }

    logger.debug("Proxy PUT response data", { hasData: !!data });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error("Proxy PUT error", error, { url });
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${API_BASE_URL}/${pathString}${
    searchParams ? `?${searchParams}` : ""
  }`;

  try {
    logger.api("DELETE", url);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    logger.debug("Proxy DELETE response received", { status: response.status });

    let data;
    const contentType = response.headers.get("content-type");

    try {
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        const text = await response.text();
        data = text ? { message: text } : {};
      }
    } catch {
      logger.debug("Response body is empty or invalid JSON");
      data = {};
    }

    logger.debug("Proxy DELETE response data", { hasData: !!data });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error("Proxy DELETE error", error, { url });
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
