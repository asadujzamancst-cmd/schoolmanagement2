from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course
from .serializer import CourseSerializer

@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
def course_api(request, pk=None):
    # 🔹 GET all or single
    if request.method == 'GET':
        if pk:
            try:
                course = Course.objects.get(pk=pk)
                serializer = CourseSerializer(course)
                return Response(serializer.data)
            except Course.DoesNotExist:
                return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            courses = Course.objects.all()
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data)

    # 🔹 POST (Create)
    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Course created successfully!', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 PATCH (Update)
    elif request.method == 'PATCH':
        if not pk:
            return Response({'error': 'Course ID is required for update'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Course updated successfully!', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 DELETE
    elif request.method == 'DELETE':
        if not pk:
            return Response({'error': 'Course ID is required for deletion'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Course.objects.get(pk=pk)
            course.delete()
            return Response({'message': 'Course deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
