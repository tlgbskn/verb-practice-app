import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h3 className="font-semibold text-red-800">Something went wrong</h3>
        <p className="text-red-700 text-sm mt-1">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors bg-red-100 px-3 py-1.5 rounded-md hover:bg-red-200"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
