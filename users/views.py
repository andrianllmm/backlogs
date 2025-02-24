from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, RegisterForm
from todolist.models import Task
from datetime import datetime, time


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
            Task.objects.create(
                title="Try adding a task!",
                description="Did it already? Tick the checkbox or drag it to the right!",
                due_date=datetime.combine(datetime.today(), time(23, 59, 59)),
                priority=0,
                assignee=user,
            )
            return redirect("todolist:index")
    else:
        form = RegisterForm()

    return render(request, "users/register.html", {"form": form})


@login_required
def logout(request):
    auth_logout(request)
    return redirect("auth:login")
