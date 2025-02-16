import wave
import numpy as np

def create_test_wav():
    # Audio parameters
    duration = 0.1  # seconds
    sample_rate = 16000  # Hz (Whisper's required sample rate)
    frequency = 440  # Hz (A4 note)

    # Generate samples
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    samples = (np.sin(2 * np.pi * frequency * t) * 32767).astype(np.int16)

    # Create WAV file
    with wave.open('test.wav', 'wb') as wav:
        wav.setnchannels(1)  # Mono
        wav.setsampwidth(2)  # 2 bytes per sample (16-bit)
        wav.setframerate(sample_rate)
        wav.writeframes(samples.tobytes())

    # Return the audio data for direct testing
    return samples.tobytes()

if __name__ == "__main__":
    audio_data = create_test_wav()
    print("Created test.wav with exactly 0.1 seconds of audio")
    print(f"File size: {len(audio_data)} bytes")
