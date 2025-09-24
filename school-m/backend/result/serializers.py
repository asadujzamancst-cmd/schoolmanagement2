from rest_framework import serializers
from .models import StudentResult

class StudentResultSerializer(serializers.ModelSerializer):
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = StudentResult
        fields = '__all__'

    def get_percentage(self, obj):
        return obj.percentage()
