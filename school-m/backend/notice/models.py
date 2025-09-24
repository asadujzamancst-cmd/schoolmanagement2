from django.db import models
from Payment.models import Student

class Notice(models.Model):
    subject = models.CharField(max_length=200)
    message = models.TextField()
    date = models.DateField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='notices/attachments/', blank=True, null=True)

    def __str__(self):
        return self.subject
