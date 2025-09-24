import csv
from django.core.management.base import BaseCommand
from result.models import Student, Subject, Result

class Command(BaseCommand):
    help = 'Import student results from CSV'

    def handle(self, *args, **kwargs):
        with open('result/result.csv', 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                student, _ = Student.objects.get_or_create(
                    student_id=row['student_id'],
                    defaults={
                        'name': row['name'],
                        'department': row['department'],
                        'semester': row['semester'],
                        'email': row['email'],
                    }
                )

                subject, _ = Subject.objects.get_or_create(
                    code=row['subject_code'],
                    defaults={
                        'name': row['subject_name'],
                        'credit': row['credit'],
                    }
                )

                Result.objects.create(
                    student=student,
                    subject=subject,
                    grade=row['grade'],
                    semester=row['semester'],
                    year=row['year']
                )
        self.stdout.write(self.style.SUCCESS('✅ All results imported successfully!'))
