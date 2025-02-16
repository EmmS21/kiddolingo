'use client';

import { useState, useEffect, useCallback } from 'react';
import { AudioRecorder } from './AudioRecorder';
import LoadingSpinner from '../ui/LoadingSpinner';
import { ChatFeedback } from './ChatFeedback';
import { ChatTranscript } from './ChatTranscript';

interface VoiceChatProps {
  language: string;
  topic: string;
  userAge: number;
}

class VoiceChatConnection {
  private ws: WebSocket | null = null;
  private onAudioResponse: (blob: Blob) => void;
  private onError: (error: string) => void;
  private onConnectionChange: (connected: boolean) => void;

  constructor(
    onAudioResponse: (blob: Blob) => void,
    onError: (error: string) => void,
    onConnectionChange: (connected: boolean) => void
  ) {
    this.onAudioResponse = onAudioResponse;
    this.onError = onError;
    this.onConnectionChange = onConnectionChange;
  }

  connect(language: string, topic: string, userAge: number) {
    const wsUrl = `ws://localhost:8000/api/voice/ws/voice?target_language=${language}&topic=${topic}&user_age=${userAge}&proficiency_level=beginner`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.onConnectionChange(true);
    };

    this.ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        this.onAudioResponse(event.data);
      }
    };

    this.ws.onerror = () => {
      this.onError('Connection error occurred');
    };

    this.ws.onclose = () => {
      this.onConnectionChange(false);
    };
  }

  sendAudio(audioBlob: Blob) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(audioBlob);
    } else {
      this.onError('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export function VoiceChat({ language, topic, userAge }: VoiceChatProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);

  const [connection] = useState(() => new VoiceChatConnection(
    (blob) => {
      // Handle audio response
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
      setIsLoading(false);
      
      // Add AI response to transcript
      setMessages(prev => [...prev, {
        text: "AI Response Played", // You might want to add actual transcription here
        isUser: false,
        timestamp: new Date()
      }]);
    },
    (error) => {
      setError(error);
      setIsLoading(false);
    },
    setIsConnected
  ));

  useEffect(() => {
    connection.connect(language, topic, userAge);
    return () => connection.disconnect();
  }, [connection, language, topic, userAge]);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setIsLoading(true);
    setError(null);
    connection.sendAudio(blob);
    
    // Add user message to transcript
    setMessages(prev => [...prev, {
      text: "Voice Message Sent", // You might want to add actual transcription here
      isUser: true,
      timestamp: new Date()
    }]);
  }, [connection]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ChatFeedback
        isConnected={isConnected}
        isRecording={isRecording}
        isProcessing={isLoading}
        error={error}
      />

      <ChatTranscript messages={messages} />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onError={setError}
          onRecordingStateChange={setIsRecording}
        />
      )}
    </div>
  );
}
