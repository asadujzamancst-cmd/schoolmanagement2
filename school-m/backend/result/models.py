from django.db import models

class StudentResult(models.Model):
    roll = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    semester = models.CharField(max_length=20)
    exam_title = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    mark = models.FloatField()
    total_mark = models.FloatField()  # পরীক্ষার মোট মার্ক

    def percentage(self):
        if self.total_mark > 0:
            return (self.mark / self.total_mark) * 100
        return 0

    def __str__(self):
        return f"{self.roll} - {self.name} ({self.exam_title} - {self.subject})"
