import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize DeepSeek client (using OpenAI compatible interface)
# In production, ensure API key is set
api_key = os.getenv("GEMINI_API_KEY") # Keeping the same env var name for now to avoid confusion, but treating it as DeepSeek key

client = None
if api_key:
    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1"
    )

async def generate_summary(text_content: dict, mode: str = "medium") -> str:
    """
    Generates a summary based on the mode.
    Modes:
    - short: TL;DR (max ~200 words)
    - medium: Study notes (bullet points, key concepts)
    - detailed: Section-by-section breakdown
    """
    if not client:
        return "[MOCK SUMMARY] API Key not found. Please set GEMINI_API_KEY in .env.\n\n" + \
               f"Mode: {mode}\nContent First 500 chars: {text_content['full_text'][:500]}..."

    full_text = text_content['full_text']
    
    # Prompt engineering based on mode
    prompts = {
        "short": "Summarize the following text in a concise TL;DR paragraph.",
        "medium": "Create detailed study notes from the following text. Use bullet points and highlight key concepts.",
        "detailed": "Provide a comprehensive summary of the text, maintaining the original structure and key sections."
    }
    
    system_instruction = prompts.get(mode, prompts["medium"])
    
    # DeepSeek context window is large (64k or more depending on model), but good to check.
    # For this MVP, we'll keep a safe limit.
    max_chars = 30000 
    input_text = full_text[:max_chars]
    if len(full_text) > max_chars:
        input_text += "\n\n[Text truncated for MVP limit...]"

    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"Text:\n{input_text}"},
            ],
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating summary: {str(e)}"
