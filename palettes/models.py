from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Palette(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    colors = models.JSONField()
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            # Each user can only have one palette with a given name, but different users can use the same name.
            models.UniqueConstraint(fields=['user', 'name'], name='unique_palette_name_per_user')
        ]
        indexes = [
            models.Index(fields=['time', 'id']),
            models.Index(fields=['-time', '-id'])
        ]
    
    def save(self, *args, **kwargs):
        if not self.name or self.name.strip() == '':
            count = Palette.objects.filter(user=self.user).count() + 1
            self.name = f"{self.user.username}'s palette {count}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} by {self.user.username}" or f"Palette #{self.id} by {self.user.username}"
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    palette = models.ForeignKey(Palette, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} liked {self.palette.user.username}'s palette on {self.time}"