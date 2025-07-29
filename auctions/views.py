from decimal import Decimal
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.shortcuts import redirect
from django.urls import reverse

from .models import User, Listing, Bid, Comment, Watchlist


def index(request):
    listings = Listing.objects.all()

    for listing in listings:
        leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
        current_price = leading_bid.amount if leading_bid else listing.starting_bid
        listing.current_price = current_price
        
    
    return render(request, "auctions/index.html", {
        "listings": listings
    })

def closed_listings(request):
    listings = Listing.objects.all()

    for listing in listings:
        leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
        current_price = leading_bid.amount if leading_bid else listing.starting_bid
        listing.current_price = current_price
        
    
    return render(request, "auctions/closed_listings.html", {
        "listings": listings
    })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
    
def create(request):
    if request.method == "POST":
        title = request.POST["title"]
        description = request.POST["description"]
        starting_bid = request.POST["starting_bid"]
        image = request.POST["image"]
        category = request.POST["category"]

        # Create a new listing
        listing = Listing(
            user=request.user,
            title=title,
            description=description,
            starting_bid=starting_bid,
            image=image,
            category=category
        )
        listing.save()

        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/create.html", {
            "categories": Listing.CATEGORY_CHOICES
        })

def listing(request, slug):
    listing = Listing.objects.get(slug=slug)
    watching = False
    leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
    current_price = leading_bid.amount if leading_bid else listing.starting_bid
    winner = leading_bid.user if leading_bid else None

    if request.user.is_authenticated:
        watching = Watchlist.objects.filter(user=request.user, listing=listing).exists()

    context = {
        "listing": listing,
        "watching": watching,
        "current_price": current_price
    }

    if not listing.is_active:
        context.update({
            "leading_bid": leading_bid,
            "winner": winner
        })
    
    return render(request, "auctions/listing.html", context)

    """
    if listing.is_active:
        return render(request, "auctions/listing.html", {
            "listing": listing,
            "watching": watching,
            "current_price": current_price
        })
    
    if not listing.is_active:
        return render(request, "auctions/listing.html", {
            "listing": listing,
            "watching": watching,
            "current_price": current_price,
            "leading_bid": leading_bid,
            "winner": winner
        })
    """
    
def add(request, slug):
    listing = Listing.objects.get(slug=slug)
    watching = Watchlist.objects.filter(user=request.user, listing=listing)
    leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
    current_price = leading_bid.amount if leading_bid else listing.starting_bid
    action = request.POST.get("action")

    if request.user.is_authenticated:
        

        if action == "remove":
            watching.delete()
    
        if action == "add":
            Watchlist.objects.create(user=request.user, listing=listing)

        return render(request, "auctions/listing.html", {
            "listing": listing,
            "watching": watching,
            "current_price": current_price
        })
    else:
        return render(request, "auctions/listing.html", {
            "listing": listing,
            "message": "Log in to use watchlist.",
            "current_price": current_price
        })

def bid(request, slug):
    listing = Listing.objects.get(slug=slug)
    leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
    current_price = leading_bid.amount if leading_bid else listing.starting_bid
    watching = Watchlist.objects.filter(user=request.user, listing=listing).exists()

    if request.POST.get("action") == "place_bid":
        if request.user.is_authenticated:
            userbid =  request.POST.get("bid", "").strip()

            if not userbid:
                return redirect("listing", slug=slug)
            
            try:
                userbid = Decimal(userbid)
            except:
                return render(request, "auctions/listing.html", {
                    "listing": listing,
                    "current_price": current_price,
                    "error": "Invalid bid entered."
                })
            
            if userbid > current_price:
                Bid.objects.create(user=request.user, listing=listing, amount=userbid)
                return redirect("listing", slug=slug)
            else:
                return render(request, "auctions/listing.html", {
                    "listing": listing,
                    "error": "Bid must be higher than the current price.",
                    "current_price": current_price,
                    "watching": watching
                })
                
        return redirect("login")
    
    return render(request, "auctions/listing.html", {
        "listing": listing,
        "current_price": current_price,
        "watching": watching
    })

def close(request, slug):
    listing = Listing.objects.get(slug=slug)
    leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
    current_price = leading_bid.amount if leading_bid else listing.starting_bid

    if request.user == listing.user:
        if request.POST.get("action") == "close":
            listing.is_active = False
            listing.save()
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "current_price": current_price
            })

def comment(request, slug):
    listing = Listing.objects.get(slug=slug)
    comments = Comment.objects.filter(listing=listing).order_by("-time")
    leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
    current_price = leading_bid.amount if leading_bid else listing.starting_bid
    watching = Watchlist.objects.filter(user=request.user, listing=listing).exists()

    if request.user.is_authenticated:
        if request.POST.get("action") == "comment":
            content = request.POST["content"]
            usercomment = Comment.objects.create(user=request.user, listing=listing, content=content)
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "usercomment": usercomment,
                "comments": comments,
                "current_price": current_price
            })
        else:
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "comments": comments,
                "current_price": current_price,
                "watching": watching
            })
    else:
        return render(request, "auctions/listing.html", {
            "listing": listing,
            "error": "Commenting requires log in.",
            "comments": comments,
            "current_price": current_price
        })

def watchlist(request):
    userwl = Watchlist.objects.filter(user=request.user)
    listings = Listing.objects.all()
    watching = Watchlist.objects.filter(user=request.user)

    if userwl:
        for item in userwl:
            listing = item.listing
            leading_bid = Bid.objects.filter(listing=listing).order_by("-amount").first()
            current_price = leading_bid.amount if leading_bid else listing.starting_bid
            listing.current_price = current_price

        return render(request, "auctions/watchlist.html", {
            "userwl": userwl,
            "listings": listings,
            "watching": watching
        })
    else:
        return render(request, "auctions/watchlist.html", {
            "message": "You don't have any items on your watchlist."
        })

def categories(request):
    return render(request, "auctions/categories.html", {
        "categories": Listing.CATEGORY_CHOICES
    })

def category(request, cat):
    listings = Listing.objects.filter(category=cat)

    if listings:
        return render(request, "auctions/category.html", {
            "cat": cat,
            "listings": listings
        })
    else:
        return render(request, "auctions/category.html", {
            "message": "There are no listings with this category."
        })