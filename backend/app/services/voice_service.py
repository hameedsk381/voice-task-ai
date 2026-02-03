"""
Voice Service - Handles voice transcription and audio processing
For MVP, uses Groq Whisper API for ultra-fast speech-to-text
"""
import os
import httpx
from typing import Optional
from groq import AsyncGroq


class VoiceService:
    """Service for voice transcription and audio processing"""
    
    def __init__(self):
        """Initialize the service with Groq client"""
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("WARNING: GROQ_API_KEY not set. Please add it to backend/.env")
        self.client = AsyncGroq(api_key=api_key) if api_key else None
    
    async def transcribe_audio(self, audio_url: str, language: str = "en") -> str:
        """
        Transcribe audio from URL using Groq Whisper (ultra-fast!)
        Supports English and Hindi
        
        Args:
            audio_url: URL to audio file (mp3, wav, etc.)
            language: Language code ('en' for English, 'hi' for Hindi, or None for auto-detect)
            
        Returns:
            Transcribed text
        """
        if not self.client:
            raise Exception("Groq API key not configured. Please add GROQ_API_KEY to backend/.env")
        
        try:
            # Download audio file
            async with httpx.AsyncClient() as http_client:
                response = await http_client.get(audio_url, timeout=30.0)
                response.raise_for_status()
                audio_data = response.content
            
            # Save temporarily (Windows compatible path)
            import tempfile
            temp_file = tempfile.mktemp(suffix=".mp3")
            with open(temp_file, "wb") as f:
                f.write(audio_data)
            
            # Transcribe using Groq Whisper (supports multiple languages!)
            with open(temp_file, "rb") as audio_file:
                # If language is 'hi', Whisper will transcribe Hindi
                # If None, auto-detect
                transcript_params = {
                    "model": "whisper-large-v3",
                    "file": audio_file,
                }
                
                if language and language in ["en", "hi"]:
                    transcript_params["language"] = language
                
                transcript = await self.client.audio.transcriptions.create(**transcript_params)
            
            # Clean up
            try:
                os.remove(temp_file)
            except:
                pass
            
            print(f"✅ Transcribed ({language or 'auto'}): {transcript.text[:100]}...")
            return transcript.text
            
        except Exception as e:
            print(f"Transcription failed: {e}")
            raise Exception(f"Failed to transcribe audio: {str(e)}")
    
    async def transcribe_file(self, file_path: str) -> str:
        """
        Transcribe audio from local file using Groq Whisper
        
        Args:
            file_path: Path to local audio file
            
        Returns:
            Transcribed text
        """
        if not self.client:
            raise Exception("Groq API key not configured. Please add GROQ_API_KEY to backend/.env")
        
        try:
            with open(file_path, "rb") as audio_file:
                transcript = await self.client.audio.transcriptions.create(
                    model="whisper-large-v3",  # Groq's Whisper model
                    file=audio_file,
                    language="en"
                )
            
            return transcript.text
            
        except Exception as e:
            print(f"Transcription failed: {e}")
            raise Exception(f"Failed to transcribe audio: {str(e)}")
    
    def validate_audio_format(self, filename: str) -> bool:
        """Validate audio file format"""
        valid_extensions = [".mp3", ".wav", ".m4a", ".ogg", ".webm"]
        return any(filename.lower().endswith(ext) for ext in valid_extensions)
