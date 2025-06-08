# backlogs

A kanban to-do list with a natural language input parser.

## About

**Backlogs** is a to-do list app (yes, another to-do list) that helps you manage tasks efficiently with a kanban layout. It automatically extracts deadlines and priorities from natural language input, making it easy to create tasks and stay on track to finish them on time. It uses no third-party libraries for kanban and rule-based natural language parser.


## Distinctiveness and Complexity

This project leverages many of the core lessons from [CS50's Web Programming](https://cs50.harvard.edu/web/2020/) course, including Django, JavaScript, Bootstrap, AJAX, and UI/UX principles. The project exceeds in complexity through the implementation of an interactive kanban board with custom drag-and-drop functionality and input highlighting. Additionally, Django’s template system is heavily utilized to create reusable components, enhancing the maintainability and scalability of the project.

While the concept of a to-do list app is common, the implementation of a kanban board with real-time updates, combined with natural language parser to process semantic dates and priorities from text, makes this project unique. Unlike the course’s other projects—such as Search, Wiki, Commerce, Mail, and Network—there is no to-do list app, and this project brings a fresh take by integrating these advanced features.


## Features

- **Responsive Kanban Board:** a drag-and-drop interface that lets you manage your tasks across different status columns
  (and yes, it also works in mobile).
- **Natural Language Parser:** natural language input is parsed to detect task due dates and priorities semantically.
- **Task Prioritization:** set task priority levels to help you organize and prioritize tasks.
- **User Authentication:** allows users to sign up and sign in with email and password to manage their own tasks.


## Usage

1. Sign up or sign in to manage your tasks.
2. Add a new task by clicking the input field and typing your task title (try adding a task with a due date and priority) Here's a good one: `Finish project next monday at noon !high`
3. Drag and drop tasks to change their status.
4. Click a task to update details and save changes.
5. Click a task to delete.


## Examples
Add images


## File Structure

```
backlogs/
├── backlogs/            # Django project settings and configurations
├── todolist/
│   ├── models.py        # Task model
│   ├── views.py         # Task views and API endpoints
│   ├── forms.py         # Add and update tasks forms
├── users/
│   ├── models.py        # Custom user model
│   ├── views.py         # User-related views (login, register)
│   ├── forms.py         # User registration and login forms
├── templates/
│   ├── layout.html      # Common layout for all pages
│   ├── components/      # Reusable frontend components
├── static/
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript modules
│   │   ├── kanban/      # Drag-and-drop functionality
│   │   ├── inputParser/ # Natural language input parser
│   │   ├── main.js      # Main JS file
├── manage.py
└── requirements.txt     # Python dependencies
```


## Development

### Tech Stack

- **Python**
- **Django**: A high-level Python web framework.
- **JavaScript**: A programming language that adds interactivity to web pages.
- **AJAX**: Asynchronous JavaScript and XML.
- **CSS**: Cascading Style Sheets.
- **Bootstrap**: A CSS framework for responsive, mobile-first web development.
- **HTML**: Hypertext Markup Language.

### Setup

1. Clone the repository:

```bash
git clone https://github.com/andrianllmm/backlogs.git
cd backlogs
```

2. Create and activate a virtual environment:

```bash
python -m venv env

# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the development server:

```bash
python manage.py runserver
```

5. Open the application in your browser:

```bash
http://localhost:8000/
``