from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, ProfileSerializer, EpisodeRatingSerializer, CharacterRatingSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, SAFE_METHODS
from .models import Profile, Episode_Rating, Character_Rating
from django.db.models import Avg
from django.http import Http404
from django.shortcuts import get_object_or_404

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def average_rating(request, type, id):
    """ Retrieve average rating for episodes or characters. """

    if type == 'character':
        average_rating = Character_Rating.objects.filter(character_id=id).aggregate(Avg('rating'))
    elif type == 'episode':
        average_rating = Episode_Rating.objects.filter(episode_id=id).aggregate(Avg('rating'))
    else:
        return Response({'error': 'Invalid type specified'}, status=status.HTTP_400_BAD_REQUEST)

    average = average_rating['rating__avg']
    if average is None:
        average = 0.0 # Default to 0
    else:
        average = round(average, 1)
    
    return Response({'average_rating': f"{average:.1f}"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cards(request, type):
    """ Retrieves the list of card ids that a user has collected. """

    if type == 'characters':
        data = Character_Rating.objects.filter(owner=request.user, is_collected=True)
        serializer = CharacterRatingSerializer(data, many=True)
    elif type == 'episodes':
        data = Episode_Rating.objects.filter(owner=request.user, is_collected=True)
        serializer = EpisodeRatingSerializer(data, many=True)
    else:
        return Response({'error': 'Invalid type specified'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data, status=status.HTTP_200_OK)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CharacterRatingDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, character_id):
        try:
            character = get_object_or_404(Character_Rating, owner=request.user, character_id=character_id)
            serializer = CharacterRatingSerializer(character)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response({'rating': 0}, status=status.HTTP_200_OK)  # Default rating if none exists

    def post(self, request, character_id):
        data = request.data

        character, created = Character_Rating.objects.get_or_create(
            owner=request.user,
            character_id=character_id,
            defaults={'rating': data.get('rating'), 'is_collected': data.get('is_collected')}
        )

        updated_fields = False
        if not created:
            if 'rating' in data:
                character.rating = data['rating']
                updated_fields = True
            if 'is_collected' in data:
                character.is_collected = data['is_collected']
                updated_fields = True
        if updated_fields:
            character.save()

        serializer = CharacterRatingSerializer(character)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

class EpisodeRatingDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, episode_id):
        try:
            episode = get_object_or_404(Episode_Rating, owner=request.user, episode_id=episode_id)
            serializer = EpisodeRatingSerializer(episode)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response({'rating': 0}, status=status.HTTP_200_OK)  # Default rating if none exists

    def post(self, request, episode_id):
        data = request.data

        episode, created = Episode_Rating.objects.get_or_create(
            owner=request.user,
            episode_id=episode_id,
            defaults={'rating': data.get('rating'), 'is_collected': data.get('is_collected')}
        )

        updated_fields = False
        if not created:
            if 'rating' in data:
                episode.rating = data['rating']
                updated_fields = True
            if 'is_collected' in data:
                episode.is_collected = data['is_collected']
                updated_fields = True
        if updated_fields:
            episode.save()

        serializer = EpisodeRatingSerializer(episode)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

class ProfileDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = get_object_or_404(Profile, owner=request.user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        data = request.data
        profile = Profile.objects.get(owner=request.user)
        updated_fields = False
        
        if 'first_name' in data:
            profile.first_name = data['first_name']
            updated_fields = True
        if 'last_name' in data:
            profile.last_name = data['last_name']
            updated_fields = True
        if 'avatar_url' in data:
            profile.avatar_url = data['avatar_url']
            updated_fields = True
        if 'avatar_name' in data:
            profile.avatar_name = data['avatar_name']
            updated_fields = True
        if 'bio' in data:
            profile.bio = data['bio']
            updated_fields = True
        
        if updated_fields:
            profile.save()
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)