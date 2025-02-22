from django.contrib.auth.decorators import login_required
from django.db.models import F
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from .models import Task
from .forms import AddTaskForm, UpdateTaskForm


@login_required
def index(request):
    if request.method == "POST":
        add_form = AddTaskForm(request.POST)
        if add_form.is_valid():
            Task.objects.create(
                title=add_form.cleaned_data.get("title"),
                due_date=add_form.cleaned_data.get("due_date"),
                assignee=request.user,
            )

        return redirect("todolist:index")
    else:
        add_form = AddTaskForm()
        update_form = UpdateTaskForm()

    tasks = (
        Task.objects.filter(assignee=request.user)
        .select_related("assignee")
        .order_by("status", F("due_date").asc(nulls_last=True))
    )
    statuses = [
        {"label": choice[1], "value": choice[0]} for choice in Task.Status.choices
    ]
    return render(
        request,
        "todolist/index.html",
        {
            "tasks": tasks,
            "add_form": add_form,
            "update_form": update_form,
            "statuses": statuses,
        },
    )


@login_required
@require_POST
def update(request, pk):
    form = UpdateTaskForm(request.POST)

    if form.is_valid():
        task = get_object_or_404(Task, id=pk)
        for field in form.cleaned_data:
            # Update only provided fields
            if field in request.POST:
                setattr(task, field, form.cleaned_data[field])
        task.save()

    return redirect("todolist:index")


@login_required
@require_POST
def delete(request, pk):
    task = get_object_or_404(Task, id=pk)
    task.delete()
    return redirect("todolist:index")
