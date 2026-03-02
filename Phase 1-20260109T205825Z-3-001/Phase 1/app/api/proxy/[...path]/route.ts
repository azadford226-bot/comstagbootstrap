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

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

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

    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    logger.debug("Proxy GET response data", { hasData: !!data });

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

  logger.debug("Proxy POST request", { url, fullPath, hasSearchParams: !!searchParams });

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
      logger.debug("No request body in POST");
    }

    logger.api("POST", url, { hasBody });

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

    if (hasBody) {
      headers["Content-Type"] = "application/json";
      fetchOptions.headers = headers;
      fetchOptions.body = JSON.stringify(body);
    } else {
      fetchOptions.headers = headers;
      fetchOptions.body = "";
    }

    const response = await fetch(url, fetchOptions);

    logger.debug("Proxy POST response received", { status: response.status });

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
