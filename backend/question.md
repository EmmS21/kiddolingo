# Summary of WebSocket Error and Working Code

## Issue Overview

We are still encountering the following error when sending audio via the WebSocket connection:

```
DEBUG:    = connection is OPEN
DEBUG:    < BINARY 52 49 46 46 a4 0c 00 00 57 41 56 45 66 6d 74 20 ... 6a ae 96 c0 a5 d4 ff e9 [3244 bytes]
DEBUG:    < CLOSE 1005 (no status received [internal]) [0 bytes]
DEBUG:    = connection is CLOSING
DEBUG:    > CLOSE 1005 (no status received [internal]) [0 bytes]
DEBUG:    x half-closing TCP connection
DEBUG:    = connection is CLOSED
INFO:     connection closed
Error processing message: received 1005 (no status received [internal]); then sent 1005 (no status received [internal])
```

## Explanation

- **Close Code 1005:**  
  The client (e.g., when using `websocat`) is sending a close frame with code 1005 (meaning "no status provided"). This typically happens when the client sends its data and immediately closes the connection.

- **Lifecycle Issue:**  
  Our server's current logic (even with extra state checks) ends up attempting operations (receiving messages, sending heartbeat or close frames) after the connection has begun closing or is already closed. This leads to errors such as "_WebSocket is not connected. Need to call 'accept' first_" and "_Cannot call 'send' once a close message has been sent_".

- **What We Learned:**  
  - Using `iter_bytes()` did not allow us to distinguish message types; hence, we switched to an explicit `receive()` loop to better differentiate between actual data, close frames, and disconnect events.
  - Despite checking the `websocket.client_state` before sending a message, the client's rapid close (with code 1005) still causes our code to attempt to process messages or send additional close frames.
  - Research suggests that adjustments such as reducing heartbeat delays or a more aggressive check on message types might help, but in our testing using the current approach, the error still appears.

## Working Code Implementation

Below is the current version of our WebSocket handler in `backend/app/api/voice.py`:

```python:backend/app/api/voice.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging
import asyncio
import time
from ..services.voice_processor import process_audio  # Relative import

router = APIRouter()
logger = logging.getLogger(__name__)

class VoiceConnectionManager:
    def __init__(self):
        self.connections = {}
        self.heartbeat_interval = 5  # seconds

    async def handle_connection(self, websocket: WebSocket):
        try:
            await websocket.accept()
        except Exception as exc:
            logger.error("Failed to accept connection: %s", exc)
            return

        conn_id = id(websocket)
        self.connections[conn_id] = websocket
        logger.info(f"New WebSocket connection established: {conn_id}")
        
        # Start the heartbeat task
        heartbeat_task = asyncio.create_task(self.send_heartbeat(websocket))
        
        try:
            while True:
                msg = await websocket.receive()  # Explicitly receive a message
                if msg["type"] == "websocket.receive":
                    if "bytes" in msg and msg["bytes"]:
                        await self.handle_message(websocket, msg["bytes"])
                elif msg["type"] == "websocket.close":
                    logger.info("Received close frame from client.")
                    break
                elif msg["type"] == "websocket.disconnect":
                    logger.info("Client disconnected.")
                    break
        except WebSocketDisconnect:
            logger.info("WebSocket disconnect encountered in loop.")
        except Exception as e:
            logger.error("Error in message processing loop: %s", e)
        finally:
            heartbeat_task.cancel()
            await self.cleanup_connection(websocket)

    async def send_heartbeat(self, websocket: WebSocket):
        try:
            while True:
                await asyncio.sleep(self.heartbeat_interval)
                if websocket.client_state.name not in ("CLOSING", "DISCONNECTED"):
                    await websocket.send_json({"type": "heartbeat", "timestamp": time.time()})
                else:
                    break
        except Exception as e:
            logger.info(f"Heartbeat task terminated: {e}")

    async def handle_message(self, websocket: WebSocket, message: bytes):
        try:
            if websocket.client_state.name in ("CLOSING", "DISCONNECTED"):
                logger.info("Skipping message processing; websocket is closing/closed.")
                return
            # Process the audio message using our voice processing pipeline.
            response = await process_audio(message)
            if websocket.client_state.name not in ("CLOSING", "DISCONNECTED"):
                await websocket.send_bytes(response)
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            try:
                if websocket.client_state.name not in ("CLOSING", "DISCONNECTED"):
                    await websocket.close(code=1011)
            except Exception as close_error:
                logger.error(f"Error while closing websocket during message handling: {close_error}")

    async def cleanup_connection(self, websocket: WebSocket):
        conn_id = id(websocket)
        if conn_id in self.connections:
            del self.connections[conn_id]
        try:
            if websocket.client_state.name not in ("DISCONNECTED",):
                await websocket.close(code=1000)
        except Exception as e:
            logger.warning("WebSocket already closed or error during close: %s", e)
        logger.info(f"Cleaned up connection: {conn_id}")

manager = VoiceConnectionManager()

@router.websocket("/ws/voice")
async def voice_endpoint(websocket: WebSocket):
    await manager.handle_connection(websocket)
```

## Conclusion and Open Questions

- The error indicates that the connection is being closed by the client (with code 1005) before our server can finish processing.  
- Our explicit message loop helps us detect close frames, but we still occasionally attempt operations on a connection in the middle of closing.  
- It may be useful to investigate further modifications, such as adjusting heartbeat timings or exploring alternative message-handling strategies, as similar issues have been noted in GitHub and StackOverflow discussions ([GitHub websockets issue](https://github.com/websockets/ws/issues/1257), [StackOverflow discussion](https://stackoverflow.com/questions/77594399/the-websocket-auto-disconnect-with-1005-and-1006-code)).

This summary is intended to provide context for further investigation and to pinpoint where our WebSocket processing can be refined to handle these early close events more gracefully.
