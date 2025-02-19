from django.db.models import F
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from .models import Task
from users.models import User
from .forms import AddTaskForm, UpdateTaskForm


def index(request):
    if request.method == "POST":
        add_form = AddTaskForm(request.POST)
        if add_form.is_valid():
            assignee = get_object_or_404(User, username="andrianllmm")

            Task.objects.create(
                title=add_form.cleaned_data.get("title"),
                due_date=add_form.cleaned_data.get("due_date"),
                assignee=assignee,
            )

        return redirect("todolist:index")
    else:
        add_form = AddTaskForm()
        update_form = UpdateTaskForm()

    tasks = Task.objects.select_related("assignee").order_by(
        "status", F("due_date").desc(nulls_last=True)
    )
    return render(
        request,
        "todolist/index.html",
        {"tasks": tasks, "add_form": add_form, "update_form": update_form},
    )


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


@require_POST
def delete(request, pk):
    task = get_object_or_404(Task, id=pk)
    task.delete()
    return redirect("todolist:index")
