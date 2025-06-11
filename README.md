<div align="center">
  <h1>backlogs</h1>
</div>

<div align="center">
  <strong>A kanban to-do list with a natural language input parser.</strong>
</div>

###

<div align="center">
  <img src="readme_preview/demo.gif" alt="backlogs" width="720">
</div>

###

## About

**Backlogs** is a to-do list app that helps you manage tasks efficiently with a kanban layout. It automatically extracts deadlines and priorities from natural language input, making it easy to create tasks and stay on track to finish them on time.


## Features

- **Responsive Kanban Board:** drag-and-drop tasks across different status columns (e.g., To Do, In Progress, Done). And yes, the layout also adapts to various screen sizes.
- **Natural Language Parser:** create tasks using intuitive natural language inputs by identifying date phrases and priority keywords.
- **Task Prioritization:** categorize tasks by priority levels such as Low, Medium, and High.
- **User Authentication:** register, log in, and manage personal backlog of tasks.


## Usage

1. Sign up or sign in to manage your tasks.
2. Add a new task by clicking the input field and typing your task title (try adding a task with a due date and priority). Here's a good one: `Finish project next monday at noon !high`
3. Drag and drop tasks to change their status.
4. Click a task to update details and save changes.
5. Click a task to delete.
6. Sign out, if you want to (I don't).


## Examples

<div style="display: flex; justify-content: space-between;">
  <img src="readme_preview/demo1.png" alt="Example 1" width="300">
  <img src="readme_preview/demo2.png" alt="Example 2" width="300">
  <img src="readme_preview/demo3.png" alt="Example 3" width="300">
</div>


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