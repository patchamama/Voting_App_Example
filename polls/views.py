from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Candidate, Vote
from django.db import IntegrityError

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