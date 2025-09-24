from django.contrib import admin
from .models import Student, Payment, TransactionHistory

admin.site.register(Student)
admin.site.register(Payment)
admin.site.register(TransactionHistory)
