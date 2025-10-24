from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from dotenv import load_dotenv
from datetime import datetime, timezone
import uuid
import os

# Optional Gemini integration
try:
    import google.generativeai as genai
except Exception:
    genai = None

# -----------------------------
# LOAD ENVIRONMENT VARIABLES
# -----------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

if GEMINI_API_KEY and genai:
    genai.configure(api_key=GEMINI_API_KEY)

# -----------------------------
# FASTAPI INITIALIZATION
# -----------------------------
app = FastAPI(
    title="Atomia Bot — AI Doubt Partner for IISER Aspirants",
    description=(
        "Atomia is an intelligent AI-powered doubt-solving assistant "
        "built for IISER aspirants preparing for the IISER Aptitude Test (IAT). "
        "It provides detailed, step-by-step reasoning in Physics, Chemistry, Mathematics, and Biology."
    ),
    version="1.0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 🧠 CORE SYSTEM CONFIGURATION
# ============================================================

SYSTEM_PROMPT = """
You are Atomia — an AI-powered academic mentor designed for IISER aspirants.
Your primary goal is to help students understand and master concepts in
Physics, Chemistry, Mathematics, and Biology (PCMB) for the IISER Aptitude Test (IAT).

💡 Approach Guidelines:
1. Give *step-by-step explanations* with clear reasoning and correct use of formulas.
2. Use *scientific accuracy* and proper terminology at an IISER-level difficulty.
3. Encourage learning through *concept clarity*, not just final answers.
4. Maintain a *calm, friendly, and motivating tone*.
5. If a question is ambiguous, politely ask for clarification.
6. Do NOT generate irrelevant or emotional content — stay academic and helpful.
7. Conclude each response with a short motivation like: “Keep learning — every step counts!”

🎯 Your objective:
To serve as a 24×7 AI mentor for IISER aspirants — making every concept understandable and inspiring.
"""

MAX_CONTEXT_MESSAGES = 15

# ============================================================
# 🧩 DATA MODELS
# ============================================================

class ChatRequest(BaseModel):
    """Incoming user message model."""
    session_id: Optional[str] = None
    message: str
    subject: Optional[str] = None  # One of: Physics | Chemistry | Mathematics | Biology


class ChatResponse(BaseModel):
    """Formatted model for Atomia's response."""
    session_id: str
    subject: Optional[str]
    text_response: str
    confidence: float
    context_used: List[Dict[str, Any]]

# ============================================================
# 💾 SESSION MANAGEMENT
# ============================================================

sessions: Dict[str, List[Dict[str, Any]]] = {}

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def ensure_session(session_id: str):
    """Ensure a chat session exists."""
    if session_id not in sessions:
        sessions[session_id] = []

def trim_context(msgs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Keep only the last N messages for context efficiency."""
    return msgs[-MAX_CONTEXT_MESSAGES:]

# ============================================================
# 🔮 GEMINI INTEGRATION LAYER
# ============================================================

def call_gemini(prompt: str, max_tokens: int = 800) -> str:
    """
    Handles communication with Gemini API.
    Returns AI-generated explanation text.
    """
    if not GEMINI_API_KEY or genai is None:
        return (
            "⚠️ Atomia (offline mode): Unable to connect to AI engine.\n\n"
            "Here’s a general reasoning outline based on your topic:\n"
            + prompt[:700]
        )
    try:
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.3,
                "top_p": 0.9,
                "max_output_tokens": max_tokens,
            },
        )
        return response.text
    except Exception as e:
        return f"Error generating content: {str(e)}"

# ============================================================
# 🧭 MAIN API ROUTES
# ============================================================

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    🎓 Endpoint: Ask Atomia a doubt
    Handles conversation memory, subject routing, and LLM response.
    """
    session_id = request.session_id or str(uuid.uuid4())
    ensure_session(session_id)

    # Record user input
    user_msg = {
        "role": "user",
        "text": request.message,
        "subject": request.subject,
        "ts": now_iso()
    }
    sessions[session_id].append(user_msg)
    sessions[session_id] = trim_context(sessions[session_id])

    # Build context-aware prompt
    context_text = "\n".join(
        [f"{m['role'].upper()}: {m['text']}" for m in sessions[session_id]]
    )
    subject_tag = f"Subject: {request.subject}" if request.subject else ""

    full_prompt = f"""{SYSTEM_PROMPT}

{subject_tag}

Recent Conversation:
{context_text}

USER QUESTION:
{request.message}

🧠 Provide a clear academic explanation following the Atomia approach.
"""

    # Generate AI output
    ai_answer = call_gemini(full_prompt)
    assistant_msg = {
        "role": "assistant",
        "text": ai_answer,
        "subject": request.subject,
        "ts": now_iso()
    }

    # Store response
    sessions[session_id].append(assistant_msg)
    sessions[session_id] = trim_context(sessions[session_id])

    return ChatResponse(
        session_id=session_id,
        subject=request.subject,
        text_response=ai_answer,
        confidence=0.9,
        context_used=sessions[session_id],
    )

# ============================================================
# 📜 UTILITY ROUTES
# ============================================================

@app.get("/sessions")
async def get_sessions():
    """List all chat sessions and their metadata."""
    return {
        "total_sessions": len(sessions),
        "sessions": [
            {
                "session_id": sid,
                "message_count": len(msgs),
                "last_activity": msgs[-1]["ts"] if msgs else None
            }
            for sid, msgs in sessions.items()
        ]
    }

@app.get("/history/{session_id}")
async def get_history(session_id: str):
    """Retrieve chat history for a given session."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "history": sessions[session_id]}

@app.post("/reset/{session_id}")
async def reset_session(session_id: str):
    """Clear an existing session’s history."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    sessions[session_id] = []
    return {"message": "Session reset successfully", "session_id": session_id}

@app.get("/")
async def root():
    """Service metadata endpoint."""
    return {
        "status": "online",
        "service_name": "Atomia Bot — Your AI Doubt Partner for IISER Aspirants",
        "version": "1.0.1",
        "llm_enabled": bool(GEMINI_API_KEY and genai is not None),
        "supported_subjects": ["Physics", "Chemistry", "Mathematics", "Biology"],
        "core_approach": {
            "explanation_style": "Step-by-step reasoning with formulas and logic",
            "tone": "Calm, encouraging, and academic",
            "focus_level": "IISER Aptitude Test (IAT) difficulty",
            "output_goal": "Concept clarity and problem-solving approach"
        },
        "creator": "Prep4IISER"
    }

# ============================================================
# ▶️ RUN SERVER
# ============================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("atomia_api:app", host="0.0.0.0", port=8000, reload=True)
