from django.contrib import admin

from .models import Palette, User, Like

# Register your models here.
class PaletteAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'time')

class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'palette', 'time')

admin.site.register(Palette, PaletteAdmin)
admin.site.register(Like, LikeAdmin)