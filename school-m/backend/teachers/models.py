from django.db import models

class TeacherJson(models.Model):  
    teacher_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    teacher_name = models.CharField(max_length=100)
    details = models.TextField()
    image = models.ImageField(upload_to='teacher/', blank=True, null=True)
    password = models.CharField(max_length=128, default='1234')

    def __str__(self):
        return self.teacher_name
