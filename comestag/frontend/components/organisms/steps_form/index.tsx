"use client";

import { useState, ReactNode, useEffect, useRef } from "react";
import Button from "@/components/atoms/button";
import StepIndicator from "@/components/atoms/step_indicator";

export interface StepConfig {
  component: ReactNode;
  hideNavigation?: boolean;
}

interface StepsFormProps {
  steps: StepConfig[];
  initialStep?: number;
  showStepIndicator?: boolean;
  heroSection?: ReactNode;
  headerSection?: ReactNode;
  onStepChange?: (step: number) => Promise<boolean> | boolean;
  onComplete?: () => void;
}

export default function StepsForm({
  steps,
  initialStep = 1,
  showStepIndicator = true,
  heroSection,
  headerSection,
  onStepChange,
  onComplete,
}: StepsFormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const formContentRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef(initialStep);

  // Scroll to form content whenever step changes
  useEffect(() => {
    if (previousStep.current !== currentStep) {
      formContentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      previousStep.current = currentStep;
    }
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep < steps.length) {
      // Validate current step before proceeding
      const canProceed = await onStepChange?.(currentStep);
      if (canProceed === false) {
        return; // Don't proceed if validation fails
      }
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    } else if (currentStep === steps.length) {
      // On the last step, clicking "Complete" should trigger onComplete
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const currentStepConfig = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;
  const showNavigation = !currentStepConfig?.hideNavigation;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section (optional) */}
      {heroSection}

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-[50px] py-6 md:py-[46px]">
        {/* Header (optional) */}
        {headerSection}

        {/* Step Indicator */}
        {showStepIndicator && (
          <div className="mb-8 md:mb-[72px]" ref={formContentRef}>
            <StepIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>
        )}

        {/* Form Content */}
        <div>{currentStepConfig?.component}</div>

        {/* Navigation Buttons */}
        {showNavigation && (
          <div className="flex justify-between gap-4 mt-12 md:mt-[84px]">
            <div onClick={handleBack}>
              <Button type="secondary" disabled={currentStep === 1}>
                ← Back
              </Button>
            </div>
            <div onClick={handleNext}>
              <Button type="primary">
                {isLastStep ? "Complete" : "Next →"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
