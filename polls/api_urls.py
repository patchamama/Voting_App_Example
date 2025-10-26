from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegisterAPIView.as_view(), name='api_register'),
    path('login/', views.UserLoginAPIView.as_view(), name='api_login'),
    path('logout/', views.UserLogoutAPIView.as_view(), name='api_logout'),
    path('candidates/', views.CandidateListAPIView.as_view(), name='api_candidates'),
    path('vote/', views.VoteCreateAPIView.as_view(), name='api_vote'),
    path('results/', views.VoteResultsAPIView.as_view(), name='api_results'),
]