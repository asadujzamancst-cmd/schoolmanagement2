from django.contrib import admin
from .models import TeacherJson  # ✅ Update import
@admin.register(TeacherJson)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['teacher_id', 'title', 'teacher_name', 'details']
