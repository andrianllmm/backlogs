from django.db import models
from users.models import User


class Task(models.Model):
    class Status(models.IntegerChoices):
        BACKLOG = 0, "Backlog"
        DOING = 1, "Doing"
        DONE = 2, "Done"

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.IntegerField(choices=Status.choices, default=Status.BACKLOG)
    due_date = models.DateField(null=True, blank=True)
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.assignee})"
