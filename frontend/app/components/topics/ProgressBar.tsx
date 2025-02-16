import { ProgressBarProps } from '../../lib/types';

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`h-2 bg-gray-200 rounded-full ${className}`}>
      <div 
        className="h-full bg-purple-600 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
