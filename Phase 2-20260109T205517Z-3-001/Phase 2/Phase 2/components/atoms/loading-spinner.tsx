interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className = "w-8 h-8" }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${className}`}></div>
  );
}