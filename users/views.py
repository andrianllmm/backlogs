from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, RegisterForm


def login(request):
    if request.user.is_authenticated:
        return redirect("todolist:index")

    if request.method == "POST":
        form = LoginForm(request.POST)
        print(form.errors)
        if form.is_valid():
            user = form.get_user()
            auth_login(request, user)
            return redirect("todolist:index")
    else:
        form = LoginForm()

    return render(request, "users/login.html", {"form": form})


def register(request):
    if request.user.is_authenticated:
        return redirect("todolist:index")

    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)
            return redirect("todolist:index")
    else:
        form = RegisterForm()

    return render(request, "users/register.html", {"form": form})


@login_required
def logout(request):
    auth_logout(request)
    return redirect("auth:login")
