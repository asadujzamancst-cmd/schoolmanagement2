from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Exam, Question, Result
from .serializers import ExamSerializer, QuestionSerializer, ResultSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        exam_id = self.request.query_params.get('exam_id')
        if exam_id:
            return Question.objects.filter(exam_id=exam_id)
        return Question.objects.all()
    queryset = Question.objects.all()


class ResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

class SubmitExamView(APIView):
    def post(self, request):
        name = request.data.get("name")
        exam_id = request.data.get("exam_id")
        answers = request.data.get("answers")

        if not name or not exam_id or not answers:
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=404)

        questions = Question.objects.filter(exam=exam)
        score = 0

        for q in questions:
            correct = q.correct_answer.strip().lower()
            submitted = answers.get(str(q.id), '').strip().lower()
            if correct == submitted:
                score += 1

        Result.objects.create(
            name=name,
            exam=exam,
            score=score,
            submitted_at=timezone.now()
        )

        return Response({
            "message": "Submitted successfully",
            "score": score,
            "total_questions": questions.count(),
            "correct_answers": score,
            "wrong_answers": questions.count() - score
        })
