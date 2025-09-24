from rest_framework import serializers
from .models import Student, Payment, TransactionHistory

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), source='student', write_only=True
    )

    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_id', 'amount', 'payment_date', 'status', 'reference_id']


class TransactionHistorySerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), source='student', write_only=True
    )
    payment_id = serializers.PrimaryKeyRelatedField(
        queryset=Payment.objects.all(), source='payment', write_only=True
    )

    class Meta:
        model = TransactionHistory
        fields = ['id', 'transaction_id', 'transaction_date', 'method', 'student', 'student_id', 'payment', 'payment_id']


