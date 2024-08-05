from django.urls import path
from . import views

urlpatterns = [
    path('episodes/ratings/<int:episode_id>/', views.EpisodeRatingDetail.as_view(), name='episode_rating_detail'),
    path('characters/ratings/<int:character_id>/', views.CharacterRatingDetail.as_view(), name='character_rating_detail'),
    path('average_rating/<str:type>/<int:id>/', views.average_rating, name='average_rating'),
    path('collection/<str:type>/', views.list_cards, name='card_list'),
    path('profile/', views.ProfileDetail.as_view(), name='profile_detail'),
]