from django.urls import path

from . import views

from django.contrib.auth.views import (
    PasswordResetView,
    PasswordResetDoneView,
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('password-reset/', PasswordResetView.as_view(template_name='palettes/password_reset.html'), name='password_reset'),
    path('password-reset/done/', PasswordResetDoneView.as_view(template_name='palettes/password_reset_done.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(template_name='palettes/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(template_name='palettes/password_reset_complete.html'), name='password_reset_complete'),
    path('create/', views.create, name='create'),
    path('profile/<str:username>', views.profile, name='profile'),
    path('like/<int:palette_id>', views.like_palette, name='like_palette'),
    path('browse', views.browse, name='browse'),
    path('pagination-ajax/', views.pagination_ajax, name='pagination_ajax'),
    path('profile_pagination_ajax/', views.profile_pagination_ajax, name='profile_pagination_ajax'),
    path('palette-detail/<int:palette_id>/json/', views.palette_detail_json, name='palette_detail_json'),
    path('delete/<int:palette_id>', views.delete, name='delete')
]