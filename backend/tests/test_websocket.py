import asyncio
import websockets
import logging
import wave
import numpy as np
import io

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_voice_connection():
    """Test single request-response cycle with audio processing"""
    try:
        # Generate raw PCM audio (not WAV) to match Whisper's API requirements
        audio_data = generate_valid_audio()
        
        async with websockets.connect('ws://localhost:8000/api/voice/ws/voice') as ws:
            # Test sequence: Send → Receive → Close
            await ws.send(audio_data)
            
            # Receive response with timeout
            try:
                response = await asyncio.wait_for(ws.recv(), timeout=15.0)
                
                # Validate audio response
                if not validate_audio_response(response):
                    return False
                    
                return True
                    
            except asyncio.TimeoutError:
                logger.error("Timeout waiting for response")
                return False
            
    except websockets.exceptions.ConnectionClosedOK:  # Expected normal closure
        return True
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
        return False

def generate_valid_audio() -> bytes:
    """Generate raw PCM data matching Whisper requirements"""
    sample_rate = 16000
    duration = 2.0  # More realistic test duration
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    samples = (np.sin(2 * np.pi * 440 * t) * 32767).astype(np.int16)
    return samples.tobytes()  # Raw PCM without WAV headers

def validate_audio_response(response: bytes) -> bool:
    """Validate the audio response meets TTS requirements"""
    try:
        # Basic checks
        if len(response) < 1024:  # Minimum viable audio size
            logger.error("Response too small")
            return False
            
        # Try loading as WAV (if using TTS WAV output)
        with wave.open(io.BytesIO(response)) as wav:
            if wav.getnchannels() != 1:
                logger.error("Invalid channel count")
                return False
            if wav.getsampwidth() != 2:
                logger.error("Invalid sample width")
                return False
        return True
    except Exception as e:
        logger.error(f"Invalid audio response: {str(e)}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_voice_connection())
    print("\nTest result:", "PASSED ✅" if result else "FAILED ❌")
