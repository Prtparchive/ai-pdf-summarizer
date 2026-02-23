import pypdf
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str):
    """
    Extracts text from a PDF file.
    Returns a dict with 'full_text' and 'pages' (list of page texts).
    """
    try:
        reader = pypdf.PdfReader(file_path)
        pages_content = []
        full_text = ""
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                cleaned = clean_text(text)
                pages_content.append({"page": i + 1, "text": cleaned})
                full_text += cleaned + "\n\n"
        
        return {
            "full_text": full_text.strip(),
            "pages": pages_content,
            "meta": reader.metadata
        }
    except Exception as e:
        logger.error(f"Error extracting PDF: {e}")
        raise e

def clean_text(text: str) -> str:
    """
    Basic text cleaning.
    """
    # Remove excessive whitespace
    text = " ".join(text.split())
    # Additional cleanup can go here (headers, footers regex)
    return text
