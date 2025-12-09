import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full" data-testid="step-indicator">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isClickable = onStepClick && (isCompleted || step.id <= currentStep);

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  transition-all text-sm font-semibold
                  ${isCompleted 
                    ? "bg-primary border-primary text-white" 
                    : isCurrent 
                      ? "bg-primary border-primary text-white" 
                      : "bg-white border-gray-200 text-gray-400"
                  }
                  ${isClickable ? "cursor-pointer hover:opacity-90" : "cursor-default"}
                `}
                data-testid={`button-step-${step.id}`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
              </button>
              <span 
                className={`
                  mt-2 text-xs font-medium text-center max-w-[80px]
                  ${isCurrent ? "text-gray-900" : "text-gray-500"}
                `}
              >
                {step.title}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-16 h-0.5 mx-2 mt-[-20px]
                  ${step.id < currentStep ? "bg-primary" : "bg-gray-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
