from rest_framework.decorators import api_view

from rest_framework.response import Response
from rest_framework import status
from .models import TeacherJson
from .serializers import TeacherSerializer

@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
 # 👈 Require login for all actions
def teacher_api(request, pk=None):
    # Only admin users can PATCH or DELETE
    if request.method in ['PATCH', 'DELETE'] and not request.user.is_staff:
        return Response({'error': 'Only admin users can update or delete teachers.'}, status=status.HTTP_403_FORBIDDEN)

    # 👉 GET all or one teacher
    if request.method == 'GET':
        if pk:
            try:
                teacher = TeacherJson.objects.get(pk=pk)
                serializer = TeacherSerializer(teacher)
                return Response(serializer.data)
            except TeacherJson.DoesNotExist:
                return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            teachers = TeacherJson.objects.all()
            serializer = TeacherSerializer(teachers, many=True)
            return Response(serializer.data)

    # 👉 CREATE teacher
    elif request.method == 'POST':
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Teacher created successfully!', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    # 👉 PATCH/UPDATE teacher
    elif request.method == 'PATCH':
        if not pk:
            return Response({'error': 'Teacher ID is required for update'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            teacher = TeacherJson.objects.get(pk=pk)
        except TeacherJson.DoesNotExist:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TeacherSerializer(teacher, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Teacher updated successfully!', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 👉 DELETE teacher
    elif request.method == 'DELETE':
        if not pk:
            return Response({'error': 'Teacher ID is required for deletion'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            teacher = TeacherJson.objects.get(pk=pk)
            teacher.delete()
            return Response({'message': 'Teacher deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
        except TeacherJson.DoesNotExist:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)



