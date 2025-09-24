import csv
from Allstudent.models import StudentUser

def run():
    with open('students.csv', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if not StudentUser.objects.filter(username=row['username']).exists():
                StudentUser.objects.create_user(
                    username=row['username'],
                    student_id=row['student_id'],
                    date_of_birth=row['date_of_birth'],
                    enrolled_year=row['enrolled_year'],
                    details=row['details'],
                    password='pass1234'  # Default password for all
                )
                print(f"✅ Created user: {row['username']}")
