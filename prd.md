

# Product Requirements Document (PRD)  
## Product: AI Voice + Task Intelligence Platform  
## Version: v1 (MVP)

---

## 1. Problem Statement

Local service businesses lose revenue and efficiency due to:
- Missed calls
- Unclear customer requests
- Poor task capture
- No structured workflow
- Delayed follow-ups

Most requests come via **phone calls or voice notes**, which are unstructured and error-prone.

The problem is **not discovery**.  
The problem is **intake and execution**.

---

## 2. Product Goal

Build an **AI voice-based intake and task intelligence system** that:
- Answers calls instantly
- Understands user intent
- Converts conversations into structured tasks
- Triggers the next operational step automatically

This is a **B2B operational tool**, not a chatbot.

---

## 3. Target Users

### Primary
- Local service businesses:
  - AC repair
  - Plumbers
  - Electricians
  - Clinics
  - Property managers
  - Apartment associations

### Secondary
- Small teams handling inbound service requests
- Admin staff overwhelmed by calls and messages

---

## 4. In-Scope (v1)

### 4.1 Voice Intake
- Inbound phone calls
- WhatsApp voice notes (optional but preferred)
- AI answers immediately
- Conversational but concise tone

---

### 4.2 Speech-to-Text
- High accuracy transcription
- Handles Indian accents
- Logs:
  - Raw audio
  - Transcript
  - Confidence score

Failure must be logged, not hidden.

---

### 4.3 Intent & Task Intelligence (Core Feature)

The system must:
- Identify **service category**
- Extract **task details**
- Infer **urgency and priority**
- Produce a **structured task object**

#### Supported Intents (max 10 in v1)
Example:
- AC Repair
- Plumbing
- Electrical
- General Maintenance
- Clinic Appointment
- Property Inspection

#### Entity Extraction
- Location
- Time preference
- Issue description
- Urgency
- Contact details

#### Output Format
```json
{
  "intent": "AC Repair",
  "issue": "No cooling",
  "urgency": "High",
  "location": "Madhapur",
  "preferred_time": "Today",
  "confidence": 0.91
}
```

If confidence < threshold → escalate.

---

### 4.4 Task Orchestration
- Auto-create tasks
- Status lifecycle:
  - New
  - In Progress
  - Escalated
  - Closed
- Notify humans via WhatsApp/SMS
- Allow manual edits

No complex workflow engine in v1.

---

### 4.5 Escalation Rules
AI must escalate when:
- Confidence score is low
- User repeats themselves
- User is angry or confused
- Pricing disputes occur

Escalation = human handoff + full context.

---

### 4.6 Admin Dashboard (Basic)
- View calls handled
- View tasks created
- View escalations
- View failures

No analytics bloat.  
Logs > charts.

---

## 5. Out of Scope (v1)

- Mobile apps
- Marketplaces
- Worker assignment optimization
- Payments
- Multi-language support beyond English
- Custom ML training
- CRM integrations (beyond basic export)

---

## 6. Non-Functional Requirements

- Latency: < 2 seconds per response
- Availability: 99% for intake
- Privacy: Store only required data
- Modularity: Voice, AI, orchestration separated
- Human override always available

---

## 7. Success Metrics

### Must-Have
- >50% reduction in missed calls
- >80% tasks usable without correction
- At least one paying customer in 14 days

### Nice-to-Have
- Reduced average response time
- Reduced admin workload

No vanity metrics allowed.

---

## 8. Assumptions

- Users prefer voice over typing
- Businesses value reliability over UI
- Manual processes are acceptable in early stages
- Early adopters tolerate rough edges

If these assumptions fail, product fails.

---

## 9. Risks & Mitigation

| Risk | Mitigation |
|----|----|
| Poor intent accuracy | Start with fewer intents |
| User mistrust | Always allow human handoff |
| Over-engineering | Ship rules + LLM hybrid |
| Voice errors | Log + retrain prompts |

---

## 10. MVP Delivery Plan (30 Days)

### Week 1
- Finalize intents
- Call scripts
- Voice setup

### Week 2
- STT + intent extraction
- Task schema
- Manual testing

### Week 3
- Orchestration
- Notifications
- Escalation logic

### Week 4
- Pilot with 1–2 real businesses
- Charge money
- Fix failures only

---

## 11. Definition of Done (v1)

The product is done when:
- It answers real calls
- Creates real tasks
- Escalates correctly
- Someone pays for it

Anything else is noise.

