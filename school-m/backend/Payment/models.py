# payments/models.py
from django.db import models
from django.utils import timezone

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    Phone_number=models.IntegerField()
    department = models.CharField(max_length=50)
    year = models.IntegerField()
    email = models.EmailField()
    college = models.CharField(max_length=100, default="Unknown College")
    password=models.CharField(max_length=100)
    img = models.ImageField(upload_to='media/Student_pic/', blank=True, null=True)
    def __str__(self):
        return f"{self.name} ({self.student_id})"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Pending', 'Pending'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    reference_id = models.CharField(max_length=100, blank=True, null=True)  # Optional transaction ID

    def __str__(self):
        return f"{self.student.name} - {self.amount} BDT - {self.status}"


class TransactionHistory(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=100, unique=True)
    transaction_date = models.DateTimeField(default=timezone.now)
    method = models.CharField(max_length=50, help_text="e.g. Bkash, Nagad, Bank Transfer")

    def __str__(self):
        return f"{self.transaction_id} - {self.student.name} - {self.method}"
    


    
