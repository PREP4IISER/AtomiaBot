# Atomia Bot - AI Doubt Partner for IISER Aspirants

## Overview
Atomia Bot is an intelligent AI-powered academic assistant designed specifically for students preparing for the IISER Aptitude Test (IAT). It provides detailed, step-by-step explanations in Physics, Chemistry, Mathematics, and Biology.

## Features
- Real-time doubt solving in PCMB subjects
- Step-by-step explanations with clear reasoning
- Scientific accuracy at IISER-level difficulty
- Persistent chat sessions with context memory
- Subject-specific routing and responses

## Tech Stack
- Backend: FastAPI (Python)
- AI Engine: Google Gemini 2.0
- RESTful API architecture
- CORS-enabled for cross-origin requests

## API Endpoints

### Main Endpoints
- `POST /chat` - Send a question to Atomia
- `GET /sessions` - List all active chat sessions
- `GET /history/{session_id}` - Retrieve chat history
- `POST /reset/{session_id}` - Clear session history
- `GET /` - Service metadata and status

### Request Format
```json
{
    "session_id": "optional-uuid",
    "message": "Your question here",
    "subject": "Physics|Chemistry|Mathematics|Biology"
}
```

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/atomia-bot.git
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your GEMINI_API_KEY to .env
```

4. Run the server
```bash
uvicorn main:app --reload
```

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key for AI responses

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
MIT License

## Created By
PREP4IISER
