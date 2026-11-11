from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ChatUser

class RegisterUserView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=400)
        user, created = ChatUser.objects.get_or_create(user_id=user_id)
        return Response({"user_id": str(user.user_id), "created": created})
