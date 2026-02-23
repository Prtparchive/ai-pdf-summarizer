from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from services import pdf_processor, ai_engine
import shutil
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are allowed.")
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    # Extract text immediately for now (can be backgrounded later)
    try:
        text_content = pdf_processor.extract_text_from_pdf(file_path)
        # In a real app, store text_content in DB or cache associated with file_id
        # For this MVP, we might just return it or keep it simple.
        # Let's return the ID and basic metadata
        return {
            "file_id": file_id,
            "filename": file.filename,
            "page_count": len(text_content.get("pages", [])),
            "message": "File uploaded and processed successfully"
        }
    except Exception as e:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.post("/summarize")
async def summarize_pdf(file_id: str, mode: str = "medium"):
    # This would retrieve the text associated with file_id and run summarization
    # For MVP, we'll re-extract or assume we have a way to get text. 
    # To keep it stateless without DB, maybe we just re-read the file from disk.
    
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    if not os.path.exists(file_path):
         raise HTTPException(status_code=404, detail="File not found")
    
    try:
        text_content = pdf_processor.extract_text_from_pdf(file_path)
        summary = await ai_engine.generate_summary(text_content, mode)
        return {"summary": summary}
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"message": "File deleted"}
    return {"message": "File not found"}
