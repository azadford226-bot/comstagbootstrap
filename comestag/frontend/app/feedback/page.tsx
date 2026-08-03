"use client";

import { useState } from "react";
import Button from "@/components/atoms/button";
import { submitContactForm } from "@/lib/api/contact";
import { isDevMode } from "@/lib/dev-auth";

const CATEGORIES = [
  { value: "general", label: "General feedback" },
  { value: "feature", label: "Feature request" },
  { value: "usability", label: "Usability / design" },
  { value: "performance", label: "Performance" },
  { value: "other", label: "Other" },
];

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    rating: "",
    message: "",
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

    const categoryLabel =
      CATEGORIES.find((c) => c.value === formData.category)?.label ??
      formData.category;
    const subject = `Feedback: ${categoryLabel}`;
    const message = `Category: ${categoryLabel}${
      formData.rating ? `\nRating: ${formData.rating}/5` : ""
    }\n\n${formData.message}`;

    try {
      if (isDevMode()) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSubmitStatus({
          type: "success",
          message:
            "Thanks for your feedback! (Dev Mode: not actually submitted)",
        });
        setFormData({ name: "", email: "", category: "general", rating: "", message: "" });
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
            result.message || "Thank you for your feedback! We appreciate it.",
        });
        setFormData({ name: "", email: "", category: "general", rating: "", message: "" });
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
          Share Your Feedback
        </h1>
        <p className="text-lg md:text-[22px] text-secondary-light font-medium max-w-2xl">
          Tell us what you love and what we can do better. Your input shapes
          ComStag.
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
              <label htmlFor="category" className="block text-sm font-medium text-primary-dark mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-primary-dark mb-2">
                Overall rating (optional)
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent bg-white"
              >
                <option value="">No rating</option>
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★ Good</option>
                <option value="3">★★★ Okay</option>
                <option value="2">★★ Poor</option>
                <option value="1">★ Very poor</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-primary-dark mb-2">
              Your feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          <Button type="primary" buttonType="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>
    </div>
  );
}
