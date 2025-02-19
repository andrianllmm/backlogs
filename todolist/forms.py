from django import forms
from .models import Task


class AddTaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ["title", "due_date"]


class UpdateTaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ["title", "description", "due_date", "status"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = False  # Make all fields optional
