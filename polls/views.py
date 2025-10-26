from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Candidate, Vote
from django.db import IntegrityError
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views import generic

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from django.contrib.auth import logout
from django.contrib.auth.models import User # Added this import

from .serializers import UserSerializer, CandidateSerializer, VoteSerializer


class SignUpView(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'polls/register.html'

@login_required(redirect_field_name=None)
def home(request):
    candidates = Candidate.objects.all()
    user_vote = None
    if request.user.is_authenticated:
        try:
            user_vote = Vote.objects.get(user=request.user)
        except Vote.DoesNotExist:
            user_vote = None

    if request.method == 'POST' and not user_vote:
        candidate_id = request.POST.get('candidate')
        if candidate_id:
            candidate = Candidate.objects.get(pk=candidate_id)
            # Since user is a OneToOneField, creating a new vote will fail if one already exists.
            # We can use update_or_create to handle this case.
            Vote.objects.update_or_create(user=request.user, defaults={'candidate': candidate})
        return redirect('home')
    
    votes = Vote.objects.all()
    return render(request, 'polls/home.html', {'candidates': candidates, 'votes': votes, 'user_vote': user_vote})


# API Views
class UserRegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data["password"])
        user.save()
        Token.objects.create(user=user)

class UserLoginAPIView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class UserLogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)

class CandidateListAPIView(generics.ListAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = (permissions.IsAuthenticated,)

class VoteCreateAPIView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        # Check if the user has already voted
        if Vote.objects.filter(user=self.request.user).exists():
            raise IntegrityError("You have already voted.")
        serializer.save(user=self.request.user)

class VoteResultsAPIView(generics.ListAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        # Optionally, filter results or aggregate them
        return Vote.objects.all().order_by('-voted_at')