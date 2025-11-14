import sys
import json
from PyPDF2 import PdfReader
from io import BytesIO
import base64

def extract_text_from_pdf(pdf_base64: str) -> str:
    """Extract text from base64-encoded PDF"""
    try:
        # Decode base64 to bytes
        pdf_bytes = base64.b64decode(pdf_base64)
        
        # Create PDF reader from bytes
        pdf_file = BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        
        # Extract text from all pages
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Clean up text
        text = text.strip()
        
        if not text:
            raise ValueError("No text extracted from PDF")
        
        return text
        
    except Exception as e:
        raise Exception(f"PDF extraction failed: {str(e)}")

if __name__ == "__main__":
    # Read input from stdin (base64 encoded PDF)
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    
    pdf_base64 = data.get("pdf_base64")
    
    if not pdf_base64:
        print(json.dumps({"error": "No PDF data provided"}))
        sys.exit(1)
    
    try:
        extracted_text = extract_text_from_pdf(pdf_base64)
        print(json.dumps({
            "success": True,
            "text": extracted_text,
            "length": len(extracted_text)
        }))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)
