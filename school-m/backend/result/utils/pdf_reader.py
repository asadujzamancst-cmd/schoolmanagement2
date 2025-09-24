# utils/pdf_reader.py
import fitz  # PyMuPDF
from result.models import StudentResult

def extract_results_from_pdf(file_path):
    doc = fitz.open(file_path)
    for page in doc:
        text = page.get_text()
        lines = text.split('\n')
        for line in lines:
            if "Roll:" in line:
                try:
                    parts = line.split('|')
                    roll = parts[0].split(':')[1].strip()
                    name = parts[1].split(':')[1].strip()
                    dept = parts[2].split(':')[1].strip()
                    sem = parts[3].split(':')[1].strip()
                    gpa = float(parts[4].split(':')[1].strip())

                    StudentResult.objects.create(
                        roll_number=roll,
                        name=name,
                        department=dept,
                        semester=sem,
                        gpa=gpa
                    )
                except:
                    continue