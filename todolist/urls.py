from django.urls import path

from . import views


app_name = "todolist"
urlpatterns = [
    path("", views.index, name="index"),
    path("update/<int:pk>", views.update, name="update"),
    path("update/api/<int:pk>", views.update_api, name="update_api"),
    path("delete/<int:pk>", views.delete, name="delete"),
]
