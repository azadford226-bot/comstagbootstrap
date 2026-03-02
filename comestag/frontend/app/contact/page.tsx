"use client";

import { useState } from "react";
import Button from "@/components/atoms/button";
import { submitContactForm } from "@/lib/api/contact";
import { isDevMode } from "@/lib/dev-auth";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // In dev mode, simulate submission
      if (isDevMode()) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitStatus({
          type: "success",
          message: "Thank you for contacting us! We'll get back to you soon. (Dev Mode: Email not sent)",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
        return;
      }

      // Submit to backend API
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Thank you for contacting us! We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
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
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[250px] md:h-[350px] flex flex-col items-center justify-center gap-4 md:gap-6 px-4 py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-[56px] font-bold text-white text-center mb-2">
            Contact Us
          </h1>
          <p className="text-xl sm:text-2xl md:text-[32px] text-secondary-light text-center font-semibold">
            We&apos;d love to hear from you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[50px] py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-6">
              Get in Touch
            </h2>
            <p className="text-base md:text-lg text-text-body mb-8">
              Have a question or need assistance? Fill out the form and we&apos;ll
              get back to you as soon as possible. You can also reach us through
              the contact information below.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:info@comstag.com"
                    className="text-text-body hover:text-primary-dark transition-colors"
                  >
                    info@comstag.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-1">
                    Office
                  </h3>
                  <p className="text-text-body">
                    Troy, MI<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-1">
                    Response Time
                  </h3>
                  <p className="text-text-body">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-6">
              Send us a Message
            </h2>

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
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primary-dark mb-2"
                >
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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-primary-dark mb-2"
                >
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

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-primary-dark mb-2"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-primary-dark mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-pale-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button
                type="primary"
                buttonType="submit"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-pale-blue">
          <h2 className="text-2xl md:text-[32px] font-semibold text-primary-dark mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                How do I create an account?
              </h3>
              <p className="text-text-body">
                Click on the &quot;Sign Up&quot; button in the top right corner
                and choose whether you&apos;re an organization or a consumer.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                How long does account approval take?
              </h3>
              <p className="text-text-body">
                Organization accounts typically take 1-3 business days for
                review and approval.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                Can I change my account type?
              </h3>
              <p className="text-text-body">
                Account types cannot be changed after registration. Please choose
                carefully during signup.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                How do I reset my password?
              </h3>
              <p className="text-text-body">
                Use the &quot;Forgot Password&quot; link on the login page to
                reset your password via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
