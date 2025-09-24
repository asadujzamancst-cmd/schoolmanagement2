from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentResultViewSet

router = DefaultRouter()
router.register(r'results', StudentResultViewSet, basename='results')

urlpatterns = [
    path('', include(router.urls)),
]
