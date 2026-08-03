"use client";

import { useState } from "react";
import Button from "@/components/atoms/button";
import { submitContactForm } from "@/lib/api/contact";
import { isDevMode } from "@/lib/dev-auth";

const SEVERITIES = [
  { value: "low", label: "Low - minor annoyance" },
  { value: "medium", label: "Medium - affects my work" },
  { value: "high", label: "High - blocks me" },
  { value: "critical", label: "Critical - app unusable / data issue" },
];

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    area: "",
    severity: "medium",
    description: "",
    steps: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const severityLabel =
      SEVERITIES.find((s) => s.value === formData.severity)?.label ??
      formData.severity;
    const subject = `Bug Report${formData.area ? ` (${formData.area})` : ""}`;
    const message = [
      `Area/Page: ${formData.area || "Not specified"}`,
      `Severity: ${severityLabel}`,
      "",
      "Description:",
      formData.description,
      "",
      "Steps to reproduce:",
      formData.steps || "Not provided",
      "",
      `Browser: ${
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown"
      }`,
    ].join("\n");

    try {
      if (isDevMode()) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSubmitStatus({
          type: "success",
          message:
            "Thanks for the report! (Dev Mode: not actually submitted)",
        });
        setFormData({ name: "", email: "", area: "", severity: "medium", description: "", steps: "" });
        return;
      }

      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject,
        message,
      });

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message:
            result.message ||
            "Thank you for reporting this. Our team will look into it.",
        });
        setFormData({ name: "", email: "", area: "", severity: "medium", description: "", steps: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[220px] md:h-[300px] flex flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-[52px] font-bold text-white">
          Report an Issue
        </h1>
        <p className="text-lg md:text-[22px] text-secondary-light font-medium max-w-2xl">
          Something not working? Tell us what happened and we&apos;ll fix it.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-dark mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-dark mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-primary-dark mb-2">
                Where did it happen?
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                placeholder="e.g. Dashboard, Messages, Profile edit"
              />
            </div>
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-primary-dark mb-2">
                Severity
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent bg-white"
              >
                {SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-primary-dark mb-2">
              What went wrong? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent resize-none"
              placeholder="Describe the problem and what you expected to happen."
            />
          </div>

          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-primary-dark mb-2">
              Steps to reproduce (optional)
            </label>
            <textarea
              id="steps"
              name="steps"
              rows={4}
              value={formData.steps}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent resize-none"
              placeholder={"1. Go to...\n2. Click on...\n3. See error"}
            />
          </div>

          <Button type="primary" buttonType="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </div>
    </div>
  );
}
