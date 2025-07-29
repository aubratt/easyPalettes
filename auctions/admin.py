from django.contrib import admin
from .models import User, Listing, Bid, Comment

# Register your models here.
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'time', 'starting_bid', 'category')
    
class BidAdmin(admin.ModelAdmin):
    list_display = ('user', 'listing', 'amount')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'listing', 'content', 'time')

admin.site.register(User)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Bid, BidAdmin)
admin.site.register(Comment, CommentAdmin)