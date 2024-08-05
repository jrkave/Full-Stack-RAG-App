from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """ Listens for the post_save signal on User model, upon which
    it creates a new Profile. """
    if created:
        Profile.objects.create(owner=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    """ Ensures associated Profile is saved after User save. """
    instance.profile.save()