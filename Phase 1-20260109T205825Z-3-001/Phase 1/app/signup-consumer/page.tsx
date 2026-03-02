"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepsForm, { StepConfig } from "@/components/organisms/steps_form";
import { Step1, Step2 } from "@/components/organisms/signup-consumer-steps";
import { registerConsumer } from "@/lib/api/auth";
import { logger } from "@/lib/logger";

export default function ConsumerSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    industry: "",
    country: "",
    city: "",
    size: "",
    established: "",
    website: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = (): boolean => {
    const requiredFields = [
      { field: "displayName", label: "Organization Name" },
      { field: "industry", label: "Industry" },
      { field: "size", label: "Company Size" },
      { field: "established", label: "Established Date" },
      { field: "website", label: "Website" },
      { field: "country", label: "Country" },
      { field: "city", label: "City" },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${label} is required`);
        return false;
      }
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const requiredFields = [
      { field: "email", label: "Email" },
      { field: "confirmEmail", label: "Confirm Email" },
      { field: "password", label: "Password" },
      { field: "confirmPassword", label: "Confirm Password" },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${label} is required`);
        return false;
      }
    }

    if (formData.email !== formData.confirmEmail) {
      setError("Email addresses do not match");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleStepChange = async (currentStep: number) => {
    setError(null);
    setLoadingMessage("");

    // Validate current step before moving to next
    if (currentStep === 1 && !validateStep1()) {
      return false;
    }

    return true;
  };

  const handleComplete = async () => {
    // Validate final step before submission
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Registering your account...");
    setError(null);

    // Map form data to API format
    const registrationData = {
      email: formData.email,
      password: formData.password,
      displayName: formData.displayName,
      industry: formData.industry,
      country: formData.country,
      city: formData.city,
      size: formData.size,
      established: formData.established,
      website: formData.website,
    };

    logger.info("Sending consumer registration data", {
      email: registrationData.email,
    });

    const result = await registerConsumer(registrationData);

    logger.info("Consumer registration result", { success: result.success });

    setIsLoading(false);
    setLoadingMessage("");

    if (!result.success) {
      setError(result.message || "Registration failed");
      logger.error("Consumer registration failed", result.message);
      return;
    }

    // Redirect to under review page after successful registration
    router.push("/signup/under-review");
  };

  const steps: StepConfig[] = [
    {
      component: <Step1 formData={formData} onChange={handleInputChange} />,
    },
    {
      component: <Step2 formData={formData} onChange={handleInputChange} />,
    },
  ];

  const heroSection = (
    <div className="bg-linear-to-b from-primary-dark via-[#3f64c4] to-primary-dark min-h-[200px] md:h-[257px] flex flex-col items-center justify-center gap-4 md:gap-[27px] px-4 sm:px-8 md:px-20 lg:px-[303px] py-8 md:py-[47px]">
      <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-white text-center">
        Welcome to ComStag
      </h1>
      <p className="text-3xl sm:text-4xl md:text-[48px] text-white text-center font-['Hubballi']">
        Connect. Collaborate. Succeed.
      </p>
    </div>
  );

  const headerSection = (
    <div className="text-center mb-12 md:mb-[94px]">
      <h2 className="text-xl md:text-[24px] font-semibold text-primary-dark mb-2">
        Create Consumer Account
      </h2>
      <p className="text-lg md:text-[20px] font-light text-primary-dark">
        Join our community as a consumer
      </p>
    </div>
  );

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary-dark font-medium">{loadingMessage}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <StepsForm
        steps={steps}
        heroSection={heroSection}
        headerSection={headerSection}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
      />
    </>
  );
}
