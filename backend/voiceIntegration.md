# Real-Time Voice Integration Guide

## Overview
This document outlines the implementation of AI-powered voice conversations using OpenAI's GPT-4o model and Whisper speech-to-text. Designed for the KiddoLingo children's language learning platform.

## Key Components
1. **WebSocket Endpoint** - `/api/chat/voice/route.ts`
2. **Audio Processing Pipeline** - STT → AI → TTS
3. **Session Management** - Context preservation per conversation

## Implementation Steps

### 1. WebSocket Server Setup 
```python:app/api/chat/voice/route.py
from fastapi import WebSocket
from openai import AsyncOpenAI
client = AsyncOpenAI()
@router.websocket("/session")
async def voice_session(websocket: WebSocket):
await websocket.accept()
try:
# Initialize conversation context
messages = [{
"role": "system",
"content": "You're a friendly language tutor for children. Keep responses under 2 sentences."
}]
while True:
# Receive audio chunk (frontend sends raw PCM data)
audio_data = await websocket.receive_bytes()
# Transcribe with Whisper
transcript = await client.audio.transcriptions.create(
file=("audio.raw", audio_data),
model="whisper-large-v3",
response_format="text"
)
# Generate response with GPT-4o
messages.append({"role": "user", "content": transcript})
response = await client.chat.completions.create(
model="gpt-4o",
messages=messages,
temperature=0.7,
max_tokens=100
)
# Convert to speech
speech = await client.audio.speech.create(
model="tts-1-hd",
voice="nova",
input=response.choices[0].message.content
)
# Send audio back
await websocket.send_bytes(speech.content)
# Update context
messages.append({
"role": "assistant",
"content": response.choices[0].message.content
})
except WebSocketDisconnect:
await websocket.close()

### 2. GPT-4o Configuration
python:lib/openai_config.py
GPT4O_SETTINGS = {
"model": "gpt-4o",
"temperature": 0.7,
"max_tokens": 150,
"system_prompt": """
You are a friendly language tutor for children aged 6-12.
Follow these rules:
1. Respond in TARGET_LANGUAGE with English translations
2. Use simple vocabulary and short sentences
3. Include emojis where appropriate 😊
4. Correct mistakes gently
"""
Correct mistakes gently}
```

### 3. Frontend Integration
```typescript:frontend/app/components/voice/VoiceChat.tsx
const startVoiceSession = async () => {
const socket = new WebSocket(${process.env.NEXT_PUBLIC_WS_URL}/api/chat/voice);
// Audio input setup
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const recorder = new MediaRecorder(stream, {
mimeType: 'audio/webm;codecs=opus',
audioBitsPerSecond: 16000
});
recorder.ondataavailable = async (event) => {
if (event.data.size > 0) {
const buffer = await event.data.arrayBuffer();
socket.send(buffer);
}
};
// Handle responses
socket.onmessage = (event) => {
const audio = new Audio(URL.createObjectURL(new Blob([event.data])));
audio.play();
};
recorder.start(500); // Send chunks every 500ms
};
```

## Interruption Handling

GPT-4o-Realtime **natively supports interruptions** through its Voice Activity Detection (VAD) system. Here's the implementation strategy:

### 1. Built-in VAD Configuration
```python
Configure VAD parameters for child speech
VAD_SETTINGS = {
"threshold": 0.3, # Lower sensitivity for softer voices
"silence_duration_ms": 1200,# Account for children's pauses
"prefix_padding_ms": 300 # Capture speech beginnings
}
```

### 2. Interruption Flow
User Speaks → VAD Detects Speech → Server Truncates Response → New Response Generated


### 3. Implementation Code
```python
Modified WebSocket handler with interruption support
async def voice_session(websocket: WebSocket):
# ... initial setup ...
while True:
audio_data = await websocket.receive_bytes()
# Check for speech overlap
if response_in_progress:
await websocket.send_json({
"type": "conversation.item.truncate",
"offset": "latest" # Truncate pending response
})
messages.pop() # Remove interrupted response from context
# Process new input
transcript = await transcribe(audio_data)
# ... generate response ...

### Key Considerations for Children:
1. **Natural Pauses**: Longer `silence_duration_ms` (1-1.5s) accommodates developing speech patterns
2. **Soft Speech**: Lower VAD `threshold` (0.2-0.4) captures quieter voices
3. **Emotional Cues**: GPT-4o detects frustration/confusion through vocal patterns
4. **Context Preservation**: Truncation events maintain accurate conversation history

### Optimization Tips from Microsoft:
- Use **server-side VAD** mode for real-time speech detection
- Implement **WebSocket connection pooling** (shown in search results) to reduce latency
- Add **audio buffering** with 300ms prefix padding to capture speech starts
```

```python
Audio buffer implementation (prevents clipped words)
class AudioBuffer:
def init(self):
self.buffer = bytearray()
self.speech_detected = False
async def process_chunk(self, chunk):
self.buffer.extend(chunk)
if self.speech_detected:
return self.flush()
return None
```

Citation: [Microsoft Voice Bot Best Practices](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/voice-bot-gpt-4o-realtime-best-practices---a-learning-from-customer-journey/4373584)

## Optimization Tips
1. **Audio Formatting**  
   Convert browser audio to Whisper's preferred format:
   - 16kHz sample rate
   - 16-bit PCM
   - Mono channel

2. **Latency Reduction**  
   ```python
   # Process audio in parallel
   async def process_audio(chunk):
       transcript, response, speech = await asyncio.gather(
           transcribe(chunk),
           generate_response(),
           create_speech()
       )
       return speech
   ```

3. **Error Recovery**  
   Implement automatic reconnection with:
   ```typescript
   let reconnectAttempts = 0;
   
   function connect() {
     socket = new WebSocket(url);
     socket.onclose = () => {
       setTimeout(connect, Math.min(1000 * (2 ** reconnectAttempts), 10000));
       reconnectAttempts++;
     };
   }
   ```

