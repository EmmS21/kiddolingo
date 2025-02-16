from openai import AsyncOpenAI
import os

class VoiceProcessor:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    async def process_audio(self, audio_data: bytes) -> bytes:
        try:
            # 1. Convert audio to text
            transcript = await self.client.audio.transcriptions.create(
                file=("audio.wav", audio_data),
                model="whisper-1",
                response_format="text"
            )
            
            # 2. Generate response
            chat_response = await self.client.chat.completions.create(
                model="gpt-4o",  
                messages=[{
                    "role": "system",
                    "content": "You are a friendly language tutor for children. Keep responses short and simple."
                }, {
                    "role": "user",
                    "content": transcript
                }],
                temperature=0.7
            )
            
            # 3. Convert response to speech
            speech = await self.client.audio.speech.create(
                model="tts-1-hd",
                voice="nova",
                input=chat_response.choices[0].message.content
            )
            
            return speech.content
            
        except Exception as e:
            print(f"Error processing audio: {str(e)}")
            raise

# Create a global instance of VoiceProcessor.
processor = VoiceProcessor()

async def process_audio(audio_data: bytes) -> bytes:
    """
    Top-level function to process audio using the global VoiceProcessor instance.
    This allows other modules to import and call process_audio directly.
    """
    return await processor.process_audio(audio_data)
