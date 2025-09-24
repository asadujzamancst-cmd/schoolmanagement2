from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamViewSet, QuestionViewSet, ResultViewSet, SubmitExamView

router = DefaultRouter()
router.register('exams', ExamViewSet)
router.register('questions', QuestionViewSet)
router.register('results', ResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('submit-exam/', SubmitExamView.as_view()),
]
