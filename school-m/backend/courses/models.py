from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=100)
    instructor = models.CharField(max_length=100)
    duration = models.IntegerField()  # ← Corrected (added parentheses)
    level = models.CharField(max_length=100)
    certificate = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.title
