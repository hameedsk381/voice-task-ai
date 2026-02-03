"""
Twilio Service - Handles real phone calls, SMS, and WhatsApp notifications
Phase 2 Implementation
"""
import os
from typing import Optional, Dict
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
from datetime import datetime


class TwilioService:
    """Service for Twilio voice calls, SMS, and WhatsApp integration"""
    
    def __init__(self):
        """Initialize Twilio client"""
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        
        if not account_sid or not auth_token:
            print("WARNING: Twilio credentials not set. SMS/WhatsApp features disabled.")
            self.client = None
        else:
            self.client = Client(account_sid, auth_token)
            print("✅ Twilio service initialized")
    
    def generate_greeting_twiml(self, language: str = "en") -> str:
        """
        Generate TwiML for greeting and recording customer voice
        
        Args:
            language: 'en' for English, 'hi' for Hindi
            
        Returns:
            TwiML XML string
        """
        response = VoiceResponse()
        
        # Greeting based on language
        greetings = {
            "en": "Hello! Thank you for calling. Please describe your service request after the beep.",
            "hi": "नमस्ते! कॉल करने के लिए धन्यवाद। कृपया बीप के बाद अपनी सेवा की आवश्यकता बताएं।"
        }
        
        greeting = greetings.get(language, greetings["en"])
        
        # Say greeting
        response.say(greeting, language=language, voice="alice")
        
        # Record the customer's message
        response.record(
            max_length=120,  # 2 minutes max
            transcribe=False,  # We'll use Groq Whisper instead
            recording_status_callback=f"{os.getenv('BACKEND_URL', '')}/api/twilio/recording-status",
            recording_status_callback_event="completed",
            action=f"{os.getenv('BACKEND_URL', '')}/api/twilio/process-recording",
            finish_on_key="#"
        )
        
        # Fallback
        response.say("Thank you. We are processing your request. Goodbye!", language="en")
        
        return str(response)
    
    def generate_confirmation_twiml(self, language: str = "en") -> str:
        """
        Generate confirmation message after recording
        """
        response = VoiceResponse()
        
        confirmations = {
            "en": "Thank you for your request. We have received it and will contact you shortly.",
            "hi": "आपके अनुरोध के लिए धन्यवाद। हमने इसे प्राप्त किया है और जल्द ही आपसे संपर्क करेंगे।"
        }
        
        response.say(confirmations.get(language, confirmations["en"]), language=language)
        
        return str(response)
    
    async def send_sms_notification(
        self,
        to_phone: str,
        message: str
    ) -> Optional[str]:
        """
        Send SMS notification
        
        Args:
            to_phone: Recipient phone number (E.164 format)
            message: Message body
            
        Returns:
            Message SID or None if failed
        """
        if not self.client:
            print(f"[SMS SIMULATION] To: {to_phone}")
            print(f"[MESSAGE] {message}")
            return None
        
        try:
            msg = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_phone
            )
            print(f"✅ SMS sent to {to_phone}: {msg.sid}")
            return msg.sid
        except Exception as e:
            print(f"❌ Failed to send SMS to {to_phone}: {e}")
            return None
    
    async def send_whatsapp_notification(
        self,
        to_phone: str,
        message: str
    ) -> Optional[str]:
        """
        Send WhatsApp notification
        
        Args:
            to_phone: Recipient phone number (E.164 format)
            message: Message body
            
        Returns:
            Message SID or None if failed
        """
        if not self.client:
            print(f"[WHATSAPP SIMULATION] To: {to_phone}")
            print(f"[MESSAGE] {message}")
            return None
        
        try:
            # WhatsApp numbers need 'whatsapp:' prefix
            to_whatsapp = f"whatsapp:{to_phone}"
            from_whatsapp = f"whatsapp:{self.phone_number}"
            
            msg = self.client.messages.create(
                body=message,
                from_=from_whatsapp,
                to=to_whatsapp
            )
            print(f"✅ WhatsApp sent to {to_phone}: {msg.sid}")
            return msg.sid
        except Exception as e:
            print(f"❌ Failed to send WhatsApp to {to_phone}: {e}")
            return None
    
    async def send_task_notification(
        self,
        task: Dict,
        notification_phone: str,
        channel: str = "sms"
    ) -> bool:
        """
        Send task notification to operations team
        
        Args:
            task: Task dictionary
            notification_phone: Phone to notify
            channel: 'sms' or 'whatsapp'
            
        Returns:
            True if sent successfully
        """
        # Format message
        urgency_emoji = {
            "high": "🔴",
            "medium": "🟡", 
            "low": "🟢"
        }
        
        emoji = urgency_emoji.get(task.get("urgency", "").lower(), "📋")
        
        message = f"""{emoji} NEW TASK ALERT

Intent: {task.get('intent', 'N/A')}
Issue: {task.get('issue', 'N/A')}
Urgency: {task.get('urgency', 'N/A').upper()}
Location: {task.get('location', 'N/A')}
Time: {task.get('preferred_time', 'N/A')}
Customer: {task.get('customer_phone', 'N/A')}

Task ID: {task.get('id', 'N/A')[:8]}
Confidence: {task.get('confidence', 0):.0%}

View dashboard to assign worker."""
        
        if channel == "whatsapp":
            result = await self.send_whatsapp_notification(notification_phone, message)
        else:
            result = await self.send_sms_notification(notification_phone, message)
        
        return result is not None
    
    async def send_escalation_notification(
        self,
        task: Dict,
        reason: str,
        notification_phone: str,
        channel: str = "whatsapp"
    ) -> bool:
        """
        Send escalation alert
        
        Args:
            task: Task dictionary
            reason: Escalation reason
            notification_phone: Phone to notify
            channel: 'sms' or 'whatsapp'
            
        Returns:
            True if sent successfully
        """
        message = f"""🚨 ESCALATION ALERT

Reason: {reason}

Task Details:
Intent: {task.get('intent', 'N/A')}
Issue: {task.get('issue', 'N/A')}
Customer: {task.get('customer_phone', 'N/A')}

Confidence: {task.get('confidence', 0):.0%}

⚠️ REQUIRES MANUAL REVIEW"""
        
        if channel == "whatsapp":
            result = await self.send_whatsapp_notification(notification_phone, message)
        else:
            result = await self.send_sms_notification(notification_phone, message)
        
        return result is not None
    
    async def send_customer_confirmation(
        self,
        customer_phone: str,
        task: Dict,
        language: str = "en",
        channel: str = "sms"
    ) -> bool:
        """
        Send confirmation to customer
        
        Args:
            customer_phone: Customer's phone number
            task: Task details
            language: 'en' or 'hi'
            channel: 'sms' or 'whatsapp'
        """
        messages = {
            "en": f"""Thank you for contacting us!

We received your {task.get('intent', 'service')} request.

Issue: {task.get('issue', 'N/A')}
Priority: {task.get('urgency', 'N/A')}

Our team will contact you at {task.get('preferred_time', 'the earliest')}.

Reference: {task.get('id', 'N/A')[:8]}""",
            
            "hi": f"""हमसे संपर्क करने के लिए धन्यवाद!

हमें आपका {task.get('intent', 'सेवा')} अनुरोध प्राप्त हुआ है।

समस्या: {task.get('issue', 'N/A')}
प्राथमिकता: {task.get('urgency', 'N/A')}

हमारी टीम आपसे {task.get('preferred_time', 'जल्द से जल्द')} संपर्क करेगी।

संदर्भ: {task.get('id', 'N/A')[:8]}"""
        }
        
        message = messages.get(language, messages["en"])
        
        if channel == "whatsapp":
            result = await self.send_whatsapp_notification(customer_phone, message)
        else:
            result = await self.send_sms_notification(customer_phone, message)
        
        return result is not None
    
    def get_recording_url(self, recording_sid: str) -> str:
        """
        Get the URL for a Twilio recording
        
        Args:
            recording_sid: Twilio recording SID
            
        Returns:
            Recording URL
        """
        if not self.client:
            return ""
        
        recording = self.client.recordings(recording_sid).fetch()
        # Twilio recording URLs are available at:
        base_url = "https://api.twilio.com"
        return f"{base_url}{recording.uri.replace('.json', '.mp3')}"
