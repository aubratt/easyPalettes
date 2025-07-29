from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify


class User(AbstractUser):
    pass

class Listing(models.Model):
    # Categories tuple
    CATEGORY_CHOICES = [
        ('broomsticks', 'Broomsticks'),
        ('clothing', 'Clothing'),
        ('jewelry', 'Jewelry'),
        ('potions', 'Potions'),
        ('wands', 'Wands')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    title = models.CharField(max_length=64)
    slug = models.SlugField(max_length=64, unique=True, blank=True)
    time = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=20)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} by {self.user.username}"

class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} bid ${self.amount} on {self.listing.title}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    content = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} commented on {self.listing.title}: {self.content}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} is watching {self.listing.title}"


