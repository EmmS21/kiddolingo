'use client';

import { useState, useCallback } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onError?: (error: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

class AudioRecorderUtil {
  private mediaRecorder: MediaRecorder | null = null;
  private onDataAvailable: (blob: Blob) => void;
  private onError: (error: string) => void;

  constructor(
    onDataAvailable: (blob: Blob) => void,
    onError: (error: string) => void
  ) {
    this.onDataAvailable = onDataAvailable;
    this.onError = onError;
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.onDataAvailable(event.data);
        }
      };

      this.mediaRecorder.onerror = () => {
        this.onError('Recording error occurred');
      };

      this.mediaRecorder.start();
    } catch (error) {
      this.onError('Failed to start recording');
    }
  }

  stopRecording() {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  isRecording() {
    return this.mediaRecorder?.state === 'recording';
  }
}

export function AudioRecorder({ 
  onRecordingComplete, 
  onError,
  onRecordingStateChange 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  }, [onError]);

  const [recorder] = useState(() => new AudioRecorderUtil(
    (blob: Blob) => {
      onRecordingComplete(blob);
      setIsRecording(false);
    },
    handleError
  ));

  const toggleRecording = async () => {
    if (isRecording) {
      recorder.stopRecording();
      setIsRecording(false);
      onRecordingStateChange?.(false);
    } else {
      setError(null);
      await recorder.startRecording();
      setIsRecording(true);
      onRecordingStateChange?.(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={toggleRecording}
        className={`p-4 rounded-full transition-colors ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isRecording ? (
            <rect x="6" y="6" width="8" height="8" /> // Stop icon
          ) : (
            <circle cx="10" cy="10" r="4" /> // Record icon
          )}
        </svg>
      </button>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
