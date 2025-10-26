from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Candidate, Vote

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'name')

class VoteSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    candidate_name = serializers.ReadOnlyField(source='candidate.name')

    class Meta:
        model = Vote
        fields = ('id', 'user', 'candidate', 'candidate_name', 'voted_at')
        read_only_fields = ('user', 'voted_at')
