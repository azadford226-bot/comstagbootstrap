"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  updateEmail,
  getOrganizationProfile,
  updateOrganizationProfile,
} from "@/lib/api/profile";
import { changePassword } from "@/lib/api/auth";
import { authenticatedGet, authenticatedPut } from "@/lib/api/api-client";
import {
  initiateDomainVerification,
  checkDomainVerification,
  listDomainVerifications,
  type DomainVerificationStatus,
} from "@/lib/domain-verification";
import {
  listRfqSubscriptions,
  deleteRfqSubscription,
  type RfqSubscription,
} from "@/lib/api/rfq-subscriptions";
import { showLocalTestNotification, isPushSupported, registerPushSubscription, unregisterPushSubscription } from "@/lib/push-notifications";
import { pushSubscriptionToPayload, savePushSubscriptionToServer, removePushSubscriptionFromServer } from "@/lib/api/push";
import { useToast } from "@/components/ui/toast";
import { Mail, Lock, Save, AlertCircle, CheckCircle, Bell, Smartphone, Loader2, Globe, Trash2, Link2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth(true);
  const { toast } = useToast();
  const [emailData, setEmailData] = useState({ newEmail: "", verificationCode: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notifPrefs, setNotifPrefs] = useState({
    emailDigest: "daily" as "immediate" | "daily" | "weekly" | "off",
    inAppEnabled: true,
    pushEnabled: false,
    rfqAlerts: true,
    messageAlerts: true,
    opportunityAlerts: true,
    systemAlerts: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [domainBusy, setDomainBusy] = useState(false);
  const [domainMsg, setDomainMsg] = useState<string | null>(null);
  const [domains, setDomains] = useState<DomainVerificationStatus[]>([]);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingUrlSaving, setMeetingUrlSaving] = useState(false);
  const [rfqSubs, setRfqSubs] = useState<RfqSubscription[]>([]);
  const [pushTestBusy, setPushTestBusy] = useState(false);

  const loadDomains = useCallback(async () => {
    const res = await listDomainVerifications();
    if (res.success && Array.isArray(res.data)) setDomains(res.data);
  }, []);

  const loadRfqSubs = useCallback(async () => {
    const res = await listRfqSubscriptions();
    if (res.success && Array.isArray(res.data)) setRfqSubs(res.data);
  }, []);

  useEffect(() => {
    loadDomains();
    loadRfqSubs();
  }, [loadDomains, loadRfqSubs]);

  useEffect(() => {
    if (user?.userType !== "ORGANIZATION") {
      try {
        setMeetingUrl(localStorage.getItem("meeting_scheduler_url") || "");
      } catch {
        /* ignore */
      }
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await getOrganizationProfile();
      const fromApi = res.success && res.data?.schedulerUrl ? res.data.schedulerUrl.trim() : "";
      let fromLegacy = "";
      try {
        fromLegacy = localStorage.getItem("meeting_scheduler_url")?.trim() || "";
      } catch {
        /* ignore */
      }
      if (!cancelled) {
        setMeetingUrl(fromApi || fromLegacy || "");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.userType]);

  const loadNotifPrefs = useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await authenticatedGet<{
        emailDigest: string;
        inAppEnabled: boolean;
        pushEnabled: boolean;
        rfqAlerts: boolean;
        messageAlerts: boolean;
        opportunityAlerts: boolean;
        systemAlerts: boolean;
      }>("/v1/settings/notifications");
      if (res.success && res.data) {
        setNotifPrefs({
          emailDigest: res.data.emailDigest as typeof notifPrefs.emailDigest,
          inAppEnabled: res.data.inAppEnabled,
          pushEnabled: res.data.pushEnabled,
          rfqAlerts: res.data.rfqAlerts,
          messageAlerts: res.data.messageAlerts,
          opportunityAlerts: res.data.opportunityAlerts,
          systemAlerts: res.data.systemAlerts,
        });
      }
    } catch { /* use defaults */ }
    setNotifLoading(false);
  }, []);

  useEffect(() => {
    loadNotifPrefs();
  }, [loadNotifPrefs]);

  const saveNotifPrefs = async () => {
    setNotifSaving(true);
    try {
      const res = await authenticatedPut("/v1/settings/notifications", notifPrefs);
      if (res.success) {
        setNotifSaved(true);
        setTimeout(() => setNotifSaved(false), 3000);

        if (typeof window !== "undefined" && isPushSupported()) {
          const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
          if (notifPrefs.pushEnabled) {
            if (!vapid) {
              toast("Push is enabled in preferences, but NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set — browser subscription was skipped.", "error");
            } else {
              try {
                const perm =
                  typeof Notification !== "undefined"
                    ? await Notification.requestPermission()
                    : "denied";
                if (perm !== "granted") {
                  toast("Notification permission denied — push may not deliver on this device.", "error");
                } else {
                  const sub = await registerPushSubscription();
                  if (sub) {
                    const saveRes = await savePushSubscriptionToServer(pushSubscriptionToPayload(sub));
                    if (!saveRes.success) {
                      toast(saveRes.message || "Could not save push subscription on the server.", "error");
                    } else {
                      toast("Push subscription saved for this device.", "success");
                    }
                  } else {
                    toast("Could not create a browser push subscription.", "error");
                  }
                }
              } catch (e) {
                toast(e instanceof Error ? e.message : "Push setup failed.", "error");
              }
            }
          } else {
            try {
              const reg = await navigator.serviceWorker.ready;
              const sub = await reg.pushManager.getSubscription();
              if (sub) {
                await removePushSubscriptionFromServer(sub.endpoint);
                await unregisterPushSubscription();
              }
            } catch {
              /* non-fatal */
            }
          }
        }
      }
    } catch { /* ignore */ }
    setNotifSaving(false);
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    
    // Check if verification code is provided
    if (!emailData.verificationCode || emailData.verificationCode.length === 0) {
      setEmailError("Please enter the verification code sent to your new email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateEmail({ 
        newEmail: emailData.newEmail,
        verificationCode: emailData.verificationCode 
      });
      if (result.success) {
        setEmailSuccess(
          "Email updated successfully! Please verify your new email address."
        );
        setEmailData({ newEmail: "", verificationCode: "" });
      } else {
        setEmailError(result.message || "Failed to update email");
      }
    } catch {
      setEmailError("An error occurred while updating email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await changePassword({
        email: user?.email || "",
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      if (result.success) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(result.message || "Failed to change password");
      }
    } catch {
      setPasswordError("An error occurred while changing password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">
            Account Settings
          </h1>
          <p className="text-text-body mt-2">
            Manage your account security and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Update Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-dark">
                  Email Address
                </h2>
                <p className="text-sm text-gray-600">Name: {user.name}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
              </div>
            </div>

            {emailSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{emailSuccess}</p>
              </div>
            )}

            {emailError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{emailError}</p>
              </div>
            )}

            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                  required
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                  placeholder="Enter new email address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={emailData.verificationCode}
                  onChange={(e) => setEmailData({ ...emailData, verificationCode: e.target.value })}
                  required
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                  placeholder="Enter verification code sent to new email"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Request verification code first using the password reset flow
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !emailData.newEmail || !emailData.verificationCode}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Updating..." : "Update Email"}
              </button>
            </form>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-dark">
                  Change Password
                </h2>
                <p className="text-sm text-gray-600">
                  Update your account password
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{passwordSuccess}</p>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                  className="w-full bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-gray-500 outline-none h-12"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  Password Requirements:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Include uppercase and lowercase letters (recommended)</li>
                  <li>Include numbers and special characters (recommended)</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !passwordData.oldPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Domain verification & scheduling */}
          <div id="domain-verification" className="bg-white rounded-xl shadow-md p-6 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-dark">Domain verification</h2>
                <p className="text-sm text-gray-600">Prove ownership with a DNS TXT record — shows a trust badge on your public profile.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="yourcompany.com"
                className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <button
                type="button"
                disabled={domainBusy || !domainInput.trim()}
                onClick={async () => {
                  setDomainBusy(true);
                  setDomainMsg(null);
                  const r = await initiateDomainVerification(domainInput.trim());
                  setDomainMsg(r.success ? (r.data?.instruction ?? "Check DNS instructions in response.") : (r.message || "Failed"));
                  setDomainBusy(false);
                  loadDomains();
                }}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm disabled:opacity-50"
              >
                Get TXT record
              </button>
              <button
                type="button"
                disabled={domainBusy || !domainInput.trim()}
                onClick={async () => {
                  setDomainBusy(true);
                  setDomainMsg(null);
                  const r = await checkDomainVerification(domainInput.trim());
                  setDomainMsg(
                    r.success && r.data?.verified
                      ? "Verified — badge will show on your profile."
                      : (r.data as { message?: string })?.message || r.message || "Not verified yet"
                  );
                  setDomainBusy(false);
                  loadDomains();
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50"
              >
                Verify now
              </button>
            </div>
            {domainMsg && <p className="text-sm text-gray-700 mb-3">{domainMsg}</p>}
            <ul className="text-sm space-y-2">
              {domains.map((d) => (
                <li key={d.domain} className="flex justify-between items-center border border-gray-100 rounded-lg px-3 py-2">
                  <span>{d.domain}</span>
                  <span className={d.verified ? "text-green-600 font-medium" : "text-amber-600"}>
                    {d.verified ? "Verified" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>

            {user.userType === "ORGANIZATION" && (
            <div id="meeting-scheduler" className="mt-8 pt-6 border-t border-gray-100 scroll-mt-24">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-primary-dark">Meeting scheduler link</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Stored on your company profile (embed or link to your chosen provider). Used in Messages → Schedule (Calendly, Microsoft Bookings, etc.).
              </p>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://calendly.com/your-org"
                  className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <button
                  type="button"
                  disabled={meetingUrlSaving}
                  onClick={async () => {
                    setMeetingUrlSaving(true);
                    const trimmed = meetingUrl.trim();
                    const r = await updateOrganizationProfile({
                      schedulerUrl: trimmed.length > 0 ? trimmed : "",
                    });
                    setMeetingUrlSaving(false);
                    if (r.success) {
                      try {
                        localStorage.setItem("meeting_scheduler_url", trimmed);
                      } catch {
                        /* ignore */
                      }
                      toast("Scheduler link saved.", "success");
                    } else {
                      toast(r.message || "Could not save scheduler URL. Try again.", "error");
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {meetingUrlSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
            )}
          </div>

          {/* RFQ alert subscriptions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-primary-dark mb-2">RFQ alert subscriptions</h2>
            <p className="text-sm text-gray-600 mb-4">Keyword and category alerts also from the RFQ page — manage them here.</p>
            {rfqSubs.length === 0 ? (
              <p className="text-sm text-gray-500">No active subscriptions.</p>
            ) : (
              <ul className="space-y-2">
                {rfqSubs.map((s) => (
                  <li key={s.id} className="flex justify-between items-center border border-gray-100 rounded-lg px-3 py-2 text-sm">
                    <span>{[s.keyword, s.category].filter(Boolean).join(" · ") || "Alert"}</span>
                    <button
                      type="button"
                      className="text-red-600 hover:underline flex items-center gap-1"
                      onClick={async () => {
                        const r = await deleteRfqSubscription(s.id);
                        if (r.success) loadRfqSubs();
                      }}
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-dark">Notification Preferences</h2>
                <p className="text-sm text-gray-600">Control how and when you receive notifications</p>
              </div>
            </div>

            {notifSaved && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">Notification preferences saved!</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Email Digest */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Digest Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["immediate", "daily", "weekly", "off"] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNotifPrefs({ ...notifPrefs, emailDigest: val })}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors capitalize ${
                        notifPrefs.emailDigest === val
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {notifPrefs.emailDigest === "immediate" && "Get an email for every notification"}
                  {notifPrefs.emailDigest === "daily" && "One daily summary email at 9 AM"}
                  {notifPrefs.emailDigest === "weekly" && "One weekly summary email on Mondays"}
                  {notifPrefs.emailDigest === "off" && "No email notifications"}
                </p>
              </div>

              {/* Channel Toggles */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Channels</h3>
                <label className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">In-app notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.inAppEnabled}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, inAppEnabled: e.target.checked })}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-700">Push notifications</span>
                      <p className="text-xs text-gray-500">Requires VAPID keys and browser permission — test locally below.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.pushEnabled}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, pushEnabled: e.target.checked })}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                </label>
                {isPushSupported() && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      disabled={pushTestBusy}
                      onClick={async () => {
                        setPushTestBusy(true);
                        await showLocalTestNotification();
                        setPushTestBusy(false);
                      }}
                      className="text-sm px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      Send test notification (this device)
                    </button>
                    <span className="text-xs text-gray-500 self-center">
                      Server push also needs VAPID keys and subscription save — this button validates the browser path.
                    </span>
                  </div>
                )}
              </div>

              {/* Category Toggles */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
                {[
                  { key: "rfqAlerts" as const, label: "RFQ updates and proposals" },
                  { key: "messageAlerts" as const, label: "New messages" },
                  { key: "opportunityAlerts" as const, label: "Opportunities and JV updates" },
                  { key: "systemAlerts" as const, label: "System announcements" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{label}</span>
                    <input
                      type="checkbox"
                      checked={notifPrefs[key]}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, [key]: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={saveNotifPrefs}
                disabled={notifSaving}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors font-semibold"
              >
                {notifSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {notifSaving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-primary-dark mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="text-gray-600">{user.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-600">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
