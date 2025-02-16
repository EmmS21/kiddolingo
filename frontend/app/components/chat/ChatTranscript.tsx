'use client';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatTranscriptProps {
  messages: Message[];
}

export function ChatTranscript({ messages }: ChatTranscriptProps) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4 p-4 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
