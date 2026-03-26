"use client";

/**
 * Debug page to check environment variables in Vercel
 * 
 * This page helps diagnose why API calls might be failing.
 * Access it at: /debug-env
 * 
 * Remove this page in production if desired.
 */

export default function DebugEnvPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE;
  const nodeEnv = process.env.NODE_ENV;

  const isConfigured = !!apiBaseUrl && apiBaseUrl.trim() !== "";
  const isDevModeEnabled = devMode === "true";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Environment Variables Debug
          </h1>

          <div className="space-y-6">
            {/* API Base URL */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  NEXT_PUBLIC_API_BASE_URL
                </h2>
                {isConfigured ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Configured
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    ❌ Not Set
                  </span>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Current Value:</p>
                <code className="block bg-gray-100 p-3 rounded text-sm break-all">
                  {apiBaseUrl || "(empty or undefined)"}
                </code>
              </div>
              {!isConfigured && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ Action Required:
                  </p>
                  <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                    <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                    <li>Add: <code className="bg-yellow-100 px-1">NEXT_PUBLIC_API_BASE_URL</code> = Your Railway URL</li>
                    <li>Redeploy Vercel after setting the variable</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Dev Mode */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  NEXT_PUBLIC_DEV_MODE
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {devMode || "(not set)"}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {isDevModeEnabled
                    ? "⚠️ Dev mode is enabled. Set to 'false' for production."
                    : "✅ Dev mode is disabled (correct for production)."}
                </p>
              </div>
            </div>

            {/* Node Environment */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                NODE_ENV
              </h2>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                {nodeEnv || "(not set)"}
              </code>
            </div>

            {/* Test Connection */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Test Backend Connection
              </h2>
              {isConfigured ? (
                <div>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `${apiBaseUrl}/actuator/health`
                        );
                        const data = await response.json();
                        alert(
                          `✅ Backend connected!\n\nStatus: ${data.status}\n\nFull response:\n${JSON.stringify(data, null, 2)}`
                        );
                      } catch (error: any) {
                        alert(
                          `❌ Backend connection failed!\n\nError: ${error.message}\n\nMake sure:\n1. Railway backend is running\n2. CORS is configured correctly\n3. URL is correct: ${apiBaseUrl}`
                        );
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Test Connection
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    This will test: <code>{apiBaseUrl}/actuator/health</code>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Configure <code>NEXT_PUBLIC_API_BASE_URL</code> first to test
                  connection.
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Quick Fix Instructions
              </h2>
              <ol className="text-sm text-gray-700 list-decimal list-inside space-y-2">
                <li>
                  Get your Railway URL from Railway Dashboard → Settings →
                  Domains
                </li>
                <li>
                  Go to Vercel Dashboard → Your Project → Settings →
                  Environment Variables
                </li>
                <li>
                  Add <code className="bg-blue-100 px-1">NEXT_PUBLIC_API_BASE_URL</code> = Your Railway URL
                </li>
                <li>
                  Add <code className="bg-blue-100 px-1">NEXT_PUBLIC_DEV_MODE</code> = <code className="bg-blue-100 px-1">false</code>
                </li>
                <li>
                  Set both for <strong>all environments</strong> (Production,
                  Preview, Development)
                </li>
                <li>
                  <strong>Redeploy Vercel</strong> (push a commit or manually
                  redeploy)
                </li>
                <li>Clear browser cache and test again</li>
              </ol>
            </div>

            {/* Current Window Info */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Current Page Info
              </h2>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Origin:</strong>{" "}
                  <code className="bg-gray-100 px-1">
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : "SSR"}
                  </code>
                </p>
                <p>
                  <strong>Full URL:</strong>{" "}
                  <code className="bg-gray-100 px-1 break-all">
                    {typeof window !== "undefined"
                      ? window.location.href
                      : "SSR"}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
