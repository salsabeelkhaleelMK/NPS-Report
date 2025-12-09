import StepIndicator from '../campaigns/StepIndicator';

const steps = [
  { id: 1, title: "Setup" },
  { id: 2, title: "Audience" },
  { id: 3, title: "Survey" },
  { id: 4, title: "Outcomes" },
  { id: 5, title: "Advanced" },
];

export default function StepIndicatorExample() {
  return (
    <StepIndicator 
      steps={steps} 
      currentStep={3} 
      onStepClick={(step) => console.log('Step clicked:', step)} 
    />
  );
}
