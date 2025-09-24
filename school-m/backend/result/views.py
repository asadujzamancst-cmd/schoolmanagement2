from rest_framework import viewsets
from .models import StudentResult
from .serializers import StudentResultSerializer

class StudentResultViewSet(viewsets.ModelViewSet):
    queryset = StudentResult.objects.all().order_by('-id')
    serializer_class = StudentResultSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        roll = self.request.query_params.get('roll')
        semester = self.request.query_params.get('semester')
        subject = self.request.query_params.get('subject')  # new
        exam_title = self.request.query_params.get('exam_title')  # new

        if roll:
            queryset = queryset.filter(roll__icontains=roll)
        if semester:
            queryset = queryset.filter(semester__icontains=semester)
        if subject:
            queryset = queryset.filter(subject__icontains=subject)
        if exam_title:
            queryset = queryset.filter(exam_title__icontains=exam_title)

        return queryset
