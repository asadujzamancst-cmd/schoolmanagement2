from rest_framework import serializers
from .models import TeacherJson

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherJson
        fields = '__all__'
