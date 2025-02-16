from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging
from ..services.voice_processor import VoiceProcessor, process_audio
import asyncio
import base64
import time
from starlette.websockets import WebSocketState
from openai import AsyncOpenAI

router = APIRouter()
logger = logging.getLogger(__name__)
voice_processor = VoiceProcessor()
client = AsyncOpenAI()

class VoiceConnectionManager:
    def __init__(self):
        self.connections = {}
        self.heartbeat_interval = 5  # seconds

    async def handle_connection(self, websocket: WebSocket):
        try:
            await websocket.accept()
            conn_id = id(websocket)
            self.connections[conn_id] = websocket
            logger.info(f"New WebSocket connection established: {conn_id}")
            
            heartbeat_task = asyncio.create_task(self.send_heartbeat(websocket))
            
            try:
                while True:
                    # Explicitly receive and handle different message types
                    message = await websocket.receive()
                    
                    if message["type"] == "websocket.disconnect":
                        logger.info("Client disconnected")
                        break
                        
                    elif message["type"] == "websocket.receive" and "bytes" in message:
                        try:
                            # Process the audio data
                            response = await process_audio(message["bytes"])
                            await websocket.send_bytes(response)
                        except Exception as e:
                            logger.info(f"Error during audio processing: {e}")
                            # Don't try to close - let the client handle it
                            break
                            
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected")
            except Exception as e:
                logger.info(f"Error in connection: {e}")
            finally:
                heartbeat_task.cancel()
                await self.cleanup_connection(websocket)
                
        except Exception as e:
            logger.error(f"Error accepting connection: {e}")

    async def send_heartbeat(self, websocket: WebSocket):
        try:
            while True:
                await asyncio.sleep(self.heartbeat_interval)
                try:
                    await websocket.send_json({"type": "heartbeat"})
                except:
                    break
        except Exception as e:
            logger.info(f"Heartbeat ended: {e}")

    async def cleanup_connection(self, websocket: WebSocket):
        try:
            conn_id = id(websocket)
            if conn_id in self.connections:
                del self.connections[conn_id]
            logger.info(f"Connection cleaned up: {conn_id}")
        except Exception as e:
            logger.info(f"Error during cleanup: {e}")

# Initialize the connection manager
manager = VoiceConnectionManager()

@router.websocket("/ws/voice")
async def voice_endpoint(websocket: WebSocket):
    await manager.handle_connection(websocket)

async def transcribe(audio_data: bytes) -> str:
    """Convert audio to text using Whisper"""
    try:
        transcript = await client.audio.transcriptions.create(
            file=("audio.raw", audio_data),
            model="whisper-large-v3",
            response_format="text"
        )
        return transcript
    except Exception as e:
        raise RuntimeError(f"Transcription failed: {str(e)}")

async def generate_response(transcript: str) -> str:
    """Generate GPT-4o response with tutoring context using the realtime preview model"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-realtime-preview-2024-12-17",
            messages=[
                {
                    "role": "system",
                    "content": "You're a friendly children's language tutor. Respond in simple, clear sentences."
                },
                {
                    "role": "user",
                    "content": transcript
                }
            ],
            temperature=0.7,
            max_tokens=100
        )
        return response.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"Response generation failed: {str(e)}")

async def text_to_speech(text: str) -> bytes:
    """Convert text to speech audio"""
    try:
        speech = await client.audio.speech.create(
            model="tts-1-hd",
            voice="nova",
            input=text
        )
        return speech.content
    except Exception as e:
        raise RuntimeError(f"Speech synthesis failed: {str(e)}")
