import os
from dotenv import load_dotenv
from openai import OpenAI
from ..core.prompts import get_language_learning_prompt
from io import BytesIO

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class VoiceProcessor:
    def __init__(self):
        self.client = client
        
    async def process_audio(self, audio_data: bytes, user_profile: dict) -> bytes:
        try:
            # 1. Convert audio to text
            audio_file = BytesIO(audio_data)
            audio_file.name = "audio.wav"
            
            transcript = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
            
            # Use the user_profile parameters passed from the frontend
            messages = [
                {"role": "system", "content": get_language_learning_prompt(
                    target_language=user_profile["target_language"],
                    topic=user_profile["current_topic"],
                    user_age=user_profile["age"],
                    proficiency_level=user_profile["proficiency_level"]
                )},
                {"role": "user", "content": transcript}
            ]
            
            # 2. Generate response
            chat_response = await self.client.chat.completions.create(
                model="gpt-4o",  
                messages=messages,
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

async def process_audio(audio_data: bytes, user_profile: dict) -> bytes:
    """
    Top-level function to process audio using the global VoiceProcessor instance.
    This allows other modules to import and call process_audio directly.
    """
    return await processor.process_audio(audio_data, user_profile)

