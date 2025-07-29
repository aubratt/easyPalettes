from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("add/<slug:slug>", views.add, name="add"),
    path("bid/<slug:slug>", views.bid, name="bid"),
    path("categories", views.categories, name="categories"),
    path("category/<str:cat>", views.category, name="category"),
    path("closed_listings", views.closed_listings, name="closed_listings"),
    path("create", views.create, name="create"),
    path("listing/<slug:slug>", views.comment, name="comment"),
    path("listing/<slug:slug>", views.listing, name="listing"),
    path("listing/<slug:slug>/closed", views.close, name="close"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("watchlist", views.watchlist, name="watchlist")
]
