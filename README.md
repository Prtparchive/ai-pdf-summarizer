# AI PDF Summarizer

A production-ready, AI-powered PDF summarizer using Next.js and FastAPI.

## Features
- **Upload**: Support for large PDF documents.
- **Smart Summarization**: TL;DR, Study Notes, and Detailed modes.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS.
- **Export**: Download summaries as Markdown.

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- OpenAI API Key (optional, for real AI features)

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up `.env` (add `OPENAI_API_KEY` if available).
5. Run server:
   ```bash
   python -m uvicorn main:app --reload
   ```

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Usage
Open `http://localhost:3000` to start summarizing your PDFs.
