from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Episode_Rating, Character_Rating

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'owner',
            'username',
            'first_name',
            'last_name',
            'avatar_url',
            'avatar_name',
            'bio',
            'cards_collected',
            'average_episode_rating',
            'average_character_rating',
            ]
        extra_kwargs = {'owner': {'read_only': True}}

class EpisodeRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode_Rating
        fields = ['id', 'episode_id', 'rating', 'owner', 'is_collected']
        extra_kwargs = {'owner': {'read_only': True}}

class CharacterRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character_Rating
        fields = ['id', 'character_id', 'rating', 'owner', 'is_collected']
        extra_kwargs = {'owner': {'read_only': True}}
