'use client';

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface ChatFeedbackProps {
  isConnected: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

export function ChatFeedback({ 
  isConnected, 
  isRecording, 
  isProcessing,
  error 
}: ChatFeedbackProps) {
  let status = 'Ready';
  let statusColor = 'bg-gray-500';

  if (!isConnected) {
    status = 'Disconnected';
    statusColor = 'bg-red-500';
  } else if (isRecording) {
    status = 'Recording...';
    statusColor = 'bg-red-500';
  } else if (isProcessing) {
    status = 'Processing...';
    statusColor = 'bg-yellow-500';
  } else if (isConnected) {
    status = 'Connected';
    statusColor = 'bg-green-500';
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span className="text-sm text-gray-600">{status}</span>
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
