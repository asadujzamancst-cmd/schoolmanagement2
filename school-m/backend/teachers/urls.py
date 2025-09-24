from django.urls import path
from .views import teacher_api

urlpatterns = [
    
    path('teacher/', teacher_api),
    path('teacher/<int:pk>/', teacher_api),
]
