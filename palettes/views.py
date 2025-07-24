from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404 ,redirect, render
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_protect

from infinite_scroll_pagination import paginator
from infinite_scroll_pagination import serializers

import base64
import json

from .models import User, Palette, Like

# Create your views here.
def index(request):
    return render(request, "palettes/index.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            next_url = request.POST.get("next")
            if next_url:
                return redirect(next_url)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "palettes/login.html", {
                "message": "Invalid username and/or password.",
                "next": request.POST.get("next", "")
            })
    else:
        return render(request, "palettes/login.html", {
            "next": request.GET.get("next", "")
        })
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "palettes/register.html", {
                "message": "Passwords must match."
            })
        
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "palettes/register.html", {
                "message": "Username already taken."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "palettes/register.html")

def create(request):
    if request.method == "POST":
        try:
            palette_name = request.POST.get("name", "").strip()
            colors_json = request.POST.get("colors", "[]")

            palette = Palette(
                user = request.user,
                name = palette_name,
                colors = json.loads(colors_json)
            )
            palette.save()

            return redirect("create")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid color data."}, status=400)
    else:
        return render(request, "palettes/create.html")

def profile(request, username):
    profile_user = User.objects.get(username=username)
    palettes = Palette.objects.filter(user=profile_user).order_by('-time', '-id')[:20]
    num_palettes = Palette.objects.filter(user=profile_user).count()
    liked_palettes = Palette.objects.filter(like__user=profile_user).order_by('-like__time')[:20]
    num_liked = Palette.objects.filter(like__user=profile_user).count()
    likes = Like.objects.filter(palette__user=profile_user)
    liked_palette_ids = []

    if request.user.is_authenticated:
        liked_palette_ids = Like.objects.filter(user=request.user).values_list("palette_id", flat=True)

    return render(request, "palettes/profile.html", {
        "profile_user": profile_user,
        "palettes": palettes,
        "likes": likes,
        "liked_palette_ids": liked_palette_ids,
        "num_palettes": num_palettes,
        "page_type": 'profile',
        "profile_username": profile_user.username,
        "liked_palettes": liked_palettes, 
        "num_liked": num_liked
    })

@csrf_protect
@login_required
def like_palette(request, palette_id):
    if request.method == "POST":
        palette = Palette.objects.get(id=palette_id)

        if request.user.is_authenticated:
            like = Like.objects.filter(user=request.user, palette=palette).first()

            if like:
                like.delete()
            else:
                Like.objects.create(user=request.user, palette=palette)
            
            palette.liked_by_user = Like.objects.filter(user=request.user, palette=palette).exists()
        else:
            palette.liked_by_user = None
        
        like_count = Like.objects.filter(palette=palette).count()
        liked_by_user = Like.objects.filter(user=request.user, palette=palette).exists()

        return JsonResponse({
            "like_count": like_count,
            "liked_by_user": liked_by_user
        })

def browse(request):
    palettes = Palette.objects.order_by('-time', '-id')[:20]
    num_palettes = Palette.objects.count()
    likes = Like.objects.all()
    liked_palette_ids = []

    if request.user.is_authenticated:
        liked_palette_ids = Like.objects.filter(user=request.user).values_list("palette_id", flat=True)

    return render(request, "palettes/browse.html", {
        "palettes": palettes,
        "likes": likes,
        "liked_palette_ids": liked_palette_ids,
        "num_palettes": num_palettes,
        "page_type": 'browse'
    })

def delete(request, palette_id):
    if request.method == "POST":
        palette = Palette.objects.get(id=palette_id)
        palette.delete()

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))

def pagination_ajax(request):
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        raise Http404()

    raw_key = request.GET.get('p', '')
    print("Raw base64 page key:", raw_key)

    try:
        decoded = base64.b64decode(raw_key).decode()
        print("Decoded page key:", decoded)

        timestamp_str, id_str = decoded.rsplit(":", 1)
        value = parse_datetime(timestamp_str)
        pk = int(id_str)

        if value is None:
            raise ValueError("Invalid datetime format")
        
    except Exception as e:
        print("Page key parsing failed:", e)
        return JsonResponse({'error': 'Invalid page key'}, status=400)

    try:
        page = paginator.paginate(
            query_set=Palette.objects.all(),
            lookup_field='-time',
            value=value,
            pk=pk,
            per_page=20,
            move_to=paginator.NEXT_PAGE
        )
    except paginator.EmptyPage:
        return JsonResponse({'error': "This page is empty"}, status=404)
    
    liked_palette_ids = []
    if request.user.is_authenticated:
        liked_palette_ids = set(Like.objects.filter(user=request.user).values_list("palette_id", flat=True))

    palettes_data = []
    for palette in page:
        try:
            palettes_data.append({
                'id': palette.id,
                'name': palette.name,
                'user': palette.user.username,
                'user_id': palette.user.id,
                'colors': palette.colors,
                'time': palette.time.isoformat(),
                'liked': palette.id in liked_palette_ids
            })
        except Exception as e:
            print("Error serializing palette:", e)
            return JsonResponse({'error': str(e)}, status=500)

    data = {
        'palettes': palettes_data,
        'request_user_id': request.user.id if request.user.is_authenticated else None,
        'has_next': page.has_next(),
        'has_prev': page.has_previous(),
        'next_objects_left': page.next_objects_left(limit=100),
        'prev_objects_left': page.prev_objects_left(limit=100),
        'next_pages_left': page.next_pages_left(limit=100),
        'prev_pages_left': page.prev_pages_left(limit=100),
        'next_page': serializers.to_page_key(**page.next_page()) if page.has_next() else None,
        'prev_page': serializers.to_page_key(**page.prev_page()) if page.has_previous() else None
    }

    return JsonResponse(data)

def profile_pagination_ajax(request):
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        raise Http404()

    username = request.GET.get('username')
    user = get_object_or_404(User, username=username)

    raw_key = request.GET.get('p', '')
    print("Raw base64 page key:", raw_key)

    try:
        decoded = base64.b64decode(raw_key).decode()
        print("Decoded page key:", decoded)

        timestamp_str, id_str = decoded.rsplit(":", 1)
        value = parse_datetime(timestamp_str)
        pk = int(id_str)

        if value is None:
            raise ValueError("Invalid datetime format")
        
    except Exception as e:
        print("Page key parsing failed:", e)
        return JsonResponse({'error': 'Invalid page key'}, status=400)

    try:
        page = paginator.paginate(
            query_set=Palette.objects.filter(user=user),
            lookup_field='-time',
            value=value,
            pk=pk,
            per_page=20,
            move_to=paginator.NEXT_PAGE
        )
    except paginator.EmptyPage:
        return JsonResponse({'error': "This page is empty"}, status=404)

    liked_palette_ids = []
    if request.user.is_authenticated:
        liked_palette_ids = set(
            Like.objects.filter(user=request.user).values_list("palette_id", flat=True)
        )

    palettes_data = []
    for palette in page:
        palettes_data.append({
            'id': palette.id,
            'name': palette.name,
            'user': palette.user.username,
            'user_id': palette.user.id,
            'colors': palette.colors,
            'time': palette.time.isoformat(),
            'liked': palette.id in liked_palette_ids
        })

    data = {
        'palettes': palettes_data,
        'request_user_id': request.user.id if request.user.is_authenticated else None,
        'has_next': page.has_next(),
        'has_prev': page.has_previous(),
        'next_objects_left': page.next_objects_left(limit=100),
        'prev_objects_left': page.prev_objects_left(limit=100),
        'next_pages_left': page.next_pages_left(limit=100),
        'prev_pages_left': page.prev_pages_left(limit=100),
        'next_page': serializers.to_page_key(**page.next_page()) if page.has_next() else None,
        'prev_page': serializers.to_page_key(**page.prev_page()) if page.has_previous() else None
    }

    return JsonResponse(data)

def palette_detail_json(request, palette_id):
    palette = get_object_or_404(Palette, id=palette_id)
    data = {
        'id': palette.id,
        'name': palette.name,
        'user': palette.user.username,
        'colors': palette.colors
    }

    return JsonResponse(data)