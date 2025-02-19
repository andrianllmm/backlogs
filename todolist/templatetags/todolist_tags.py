from django import template

register = template.Library()


@register.filter(name="filter_tasks")
def filter_tasks(tasks, status):
    return [task for task in tasks if task.status == status]
