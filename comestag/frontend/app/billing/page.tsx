"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { createCheckout, createCustomerPortal, getSubscription, type SubscriptionStatus } from "@/lib/api/billing";

const activeStatuses = new Set(["trialing", "active"]);

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function BillingContent() {
  const { user, isLoading } = useAuth(true);
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadSubscription() {
      setLoading(true);
      const result = await getSubscription();
      if (cancelled) return;
      if (result.success && result.data) {
        setSubscription(result.data);
        setError("");
      } else {
        setError(result.message || "Could not load your subscription.");
      }
      setLoading(false);
    }
    loadSubscription();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (user?.userType !== "ORGANIZATION") {
    return (
      <section className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-text-dark">Organization billing</h1>
        <p className="mt-3 text-gray-600">Billing is available to organization accounts.</p>
        <Link href="/dashboard" className="inline-flex mt-6 text-primary font-medium hover:underline">Return to dashboard</Link>
      </section>
    );
  }

  const checkoutResult = searchParams.get("checkout");
  const isActive = subscription ? activeStatuses.has(subscription.status) : false;
  const periodEnd = formatDate(subscription?.currentPeriodEndsAt);
  const trialEnd = formatDate(subscription?.trialEndsAt);

  async function startCheckout() {
    setStartingCheckout(true);
    setError("");
    const result = await createCheckout();
    if (result.success && result.data?.checkoutUrl) {
      window.location.assign(result.data.checkoutUrl);
      return;
    }
    setError(result.message || "Could not start secure checkout.");
    setStartingCheckout(false);
  }

  async function openCustomerPortal() {
    setOpeningPortal(true);
    setError("");
    const result = await createCustomerPortal();
    if (result.success && result.data?.portalUrl) {
      window.location.assign(result.data.portalUrl);
      return;
    }
    setError(result.message || "Could not open subscription management.");
    setOpeningPortal(false);
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex items-start gap-4 mb-8">
        <div className="p-3 rounded-lg bg-primary/10 text-primary"><CreditCard className="w-6 h-6" /></div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-dark">Billing</h1>
          <p className="mt-1 text-gray-600">Manage your organization&apos;s Comstag subscription.</p>
        </div>
      </div>

      {checkoutResult === "success" && (
        <div className="mb-6 flex gap-3 p-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-none" />
          <p className="text-sm">Checkout completed. Your subscription status will update after Stripe confirms it.</p>
        </div>
      )}
      {checkoutResult === "cancelled" && (
        <div className="mb-6 flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-none" />
          <p className="text-sm">Checkout was cancelled. No charge was made.</p>
        </div>
      )}
      {error && (
        <div className="mb-6 flex gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-none" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="border border-light-gray rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-light-gray">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Organization plan</p>
              <p className="mt-1 text-3xl font-semibold text-text-dark">$49 <span className="text-base font-normal text-gray-500">USD / month</span></p>
            </div>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"}`}>
                {subscription?.status === "NONE" ? "No subscription" : subscription?.status || "Unknown"}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-600">Start with a 90-day free trial. Your monthly subscription begins when the trial ends.</p>
        </div>

        <div className="p-6 sm:p-8">
          {trialEnd && <p className="text-sm text-gray-700">Trial ends: <span className="font-medium">{trialEnd}</span></p>}
          {periodEnd && <p className="mt-2 text-sm text-gray-700">Current period ends: <span className="font-medium">{periodEnd}</span></p>}
          {subscription?.cancelAtPeriodEnd && <p className="mt-2 text-sm text-amber-700">Your subscription is set to cancel at the end of the current period.</p>}

          {!loading && !subscription?.configured && (
            <p className="text-sm text-gray-600">Online billing is not configured yet. Please contact Comstag support.</p>
          )}
          {!loading && subscription?.configured && !isActive && (
            <button
              type="button"
              onClick={startCheckout}
              disabled={startingCheckout}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {startingCheckout && <Loader2 className="w-4 h-4 animate-spin" />}
              {startingCheckout ? "Opening secure checkout" : "Start 90-day free trial"}
            </button>
          )}
          {!loading && subscription?.configured && isActive && (
            <button
              type="button"
              onClick={openCustomerPortal}
              disabled={openingPortal}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {openingPortal && <Loader2 className="w-4 h-4 animate-spin" />}
              {openingPortal ? "Opening subscription management" : "Manage subscription"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <BillingContent />
    </Suspense>
  );
}