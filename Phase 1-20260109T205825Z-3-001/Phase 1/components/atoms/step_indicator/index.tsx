interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps = 5,
}: StepIndicatorProps) {
  return (
    <div className="flex gap-2 sm:gap-4 md:gap-[30px] items-center justify-center overflow-x-auto px-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div
            key={stepNumber}
            className="flex gap-1 sm:gap-2 md:gap-[11px] items-center shrink-0"
          >
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center rounded-[15px] w-[30px] h-[30px] ${
                isActive
                  ? "bg-[#3d5ba8]"
                  : isCompleted
                  ? "bg-[#3d5ba8]"
                  : "bg-[#959595]"
              }`}
            >
              <p
                className={`text-sm sm:text-base md:text-lg font-medium ${
                  isActive || isCompleted ? "text-white" : "text-[#dbdbdb]"
                }`}
              >
                {stepNumber}
              </p>
            </div>

            {/* Connector Line */}
            {stepNumber < totalSteps && (
              <div className="w-8 sm:w-12 md:w-[83px] h-0 border-t border-[#959595]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
