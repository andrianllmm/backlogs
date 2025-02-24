from django import template

register = template.Library()


@register.filter(name="filter_tasks")
def filter_tasks(tasks, status):
    return [task for task in tasks if task.status == status]


@register.filter(name="format_datetime_local")
def format_datetime_local(value):
    """Format a datetime object as 'YYYY-MM-DDTHH:MM' for datetime-local input fields."""
    if value is None or isinstance(value, str):
        return ""
    return value.strftime("%Y-%m-%dT%H:%M")
