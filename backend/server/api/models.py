from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg

# Create your models here.
class Profile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    avatar_url = models.TextField(default='/images/default_avatar.jpeg')
    avatar_name = models.TextField(default='None')
    bio = models.TextField()

    def __str__(self):
        return self.owner.username
    
    @property
    def cards_collected(self):
        episode_count = Episode_Rating.objects.filter(owner=self.owner, is_collected=True).count()
        character_count = Character_Rating.objects.filter(owner=self.owner, is_collected=True).count()
        return (episode_count + character_count)

    @property
    def average_episode_rating(self):
        ep_ratings = Episode_Rating.objects.filter(owner=self.owner).aggregate(Avg('rating'))
        average = ep_ratings['rating__avg']
        if average is None:
            return '0.0'
        return f'{average:.1f}'
    
    @property
    def average_character_rating(self):
        char_ratings = Character_Rating.objects.filter(owner=self.owner).aggregate(Avg('rating'))
        average = char_ratings['rating__avg']
        if average is None:
            return '0.0'
        return f'{average:.1f}'
    
    @property
    def username(self):
        return self.owner.username

class Episode_Rating(models.Model):
    id = models.AutoField(primary_key=True)
    episode_id = models.IntegerField()
    rating = models.IntegerField(null=True, blank=True)
    is_collected = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('episode_id', 'owner'))

class Character_Rating(models.Model):
    id = models.AutoField(primary_key=True)
    character_id = models.IntegerField()
    rating = models.IntegerField(null=True, blank=True)
    is_collected = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('character_id', 'owner'))