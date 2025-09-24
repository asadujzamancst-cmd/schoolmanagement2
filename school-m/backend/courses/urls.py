from django.urls import path
from .views import course_api

urlpatterns = [
    path('course/', course_api),           # For GET all, POST
    path('course/<int:pk>/', course_api),  # For GET single, PATCH, DELETE
]
