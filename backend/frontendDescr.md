# Backend Integration Guide for Frontend

## WebSocket Voice Endpoint

### Connection Details
```typescript
const wsUrl = `ws://localhost:8000/api/voice/ws/voice?target_language=${language}&topic=${topic}&user_age=${age}&proficiency_level=${level}`;
```

### Required Query Parameters
- `target_language`: string (e.g., "Spanish", "French")
- `topic`: string (e.g., "Animals", "Colors")
- `user_age`: number (e.g., 8)
- `proficiency_level`: string (default: "beginner")

### WebSocket Communication Flow

1. **Connection Establishment**
   ```typescript
   const ws = new WebSocket(wsUrl);
   ```

2. **Sending Audio**
   - Format: Binary WAV audio data
   - Sample Rate: 16000Hz
   - Channels: 1 (Mono)
   ```typescript
   ws.send(audioBlob);  // audioBlob should be WAV format
   ```

3. **Receiving Responses**
   The server returns binary audio data containing:
   - Response in target language
   - English translation
   - Teaching moments
   - Corrections (if needed)

4. **Heartbeat Messages**
   - Server sends: `{"type": "heartbeat"}` every 5 seconds
   - No client response needed

### Example Implementation

```typescript
class VoiceChat {
    private ws: WebSocket;
    
    constructor(language: string, topic: string, age: number) {
        const wsUrl = `ws://localhost:8000/api/voice/ws/voice?target_language=${language}&topic=${topic}&user_age=${age}`;
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('Connected to voice chat');
        };
        
        this.ws.onmessage = (event) => {
            if (event.data instanceof Blob) {
                // Handle audio response
                const audioBlob = event.data;
                this.playResponse(audioBlob);
            } else {
                // Handle heartbeat or other text messages
                const message = JSON.parse(event.data);
                if (message.type === 'heartbeat') {
                    // Heartbeat received
                }
            }
        };
    }
    
    async sendAudio(audioBlob: Blob) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(audioBlob);
        }
    }
    
    private async playResponse(audioBlob: Blob) {
        const audio = new Audio(URL.createObjectURL(audioBlob));
        await audio.play();
    }
}
```

### Error Handling

1. **Connection Errors**
   ```typescript
   ws.onerror = (error) => {
       console.error('WebSocket error:', error);
   };
   ```

2. **Connection Close**
   ```typescript
   ws.onclose = (event) => {
       if (event.code === 1000) {
           console.log('Connection closed normally');
       } else {
           console.log('Connection closed with code:', event.code);
       }
   };
   ```

### Audio Requirements

1. **Input Audio**
   - Format: WAV
   - Sample Rate: 16000Hz
   - Channels: 1 (Mono)
   - Encoding: 16-bit PCM

2. **Response Audio**
   - Format: MP3
   - Can be played directly using Audio API
   - Contains both language instruction and translations

### Example Usage

```typescript
// Initialize voice chat
const voiceChat = new VoiceChat('Spanish', 'Animals', 8);

// Start recording (using your preferred audio recording method)
const audioBlob = await recordAudio();  // Your recording implementation

// Send to server
await voiceChat.sendAudio(audioBlob);

// Response will be handled by onmessage event handler
```

### Notes for Implementation

1. **Audio Recording**
   - Implement proper audio recording in WAV format
   - Ensure correct sample rate and encoding
   - Consider using MediaRecorder API

2. **Response Handling**
   - Response is binary audio data
   - Can be played immediately or stored
   - Consider UI feedback during processing

3. **Connection Management**
   - Handle reconnection if needed
   - Clean up connection on component unmount
   - Monitor heartbeat for connection health

4. **User Experience**
   - Show loading state while processing
   - Provide visual feedback for recording
   - Indicate when response is playing
