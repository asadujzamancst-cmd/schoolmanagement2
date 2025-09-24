from django.contrib import admin
from .models import Course

class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'duration', 'level', 'certificate', 'price', 'description']

admin.site.register(Course, CourseAdmin)
