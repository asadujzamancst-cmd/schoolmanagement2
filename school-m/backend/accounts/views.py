from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .searializers import UserSerializer

User = get_user_model()

class UserDashboardView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
