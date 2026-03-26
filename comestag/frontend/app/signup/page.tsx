import { Suspense } from "react";
import SignupFormContent from "./signup-form-content";

function SignupLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="text-sm text-gray-600">Loading signup…</p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupFormContent />
    </Suspense>
  );
}
