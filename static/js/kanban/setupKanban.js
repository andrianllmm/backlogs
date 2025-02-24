export default function setupKanban() {
  let draggedTask = null;

  document.querySelectorAll('.kanban-task').forEach((task) => {
    task.setAttribute('draggable', 'true');

    task.addEventListener('dragstart', function (event) {
      setTimeout(() => task.classList.add('dragging'), 0);
      draggedTask = event.target;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    });

    task.addEventListener('dragend', function () {
      draggedTask.classList.remove('dragging');
      draggedTask = null;
      document.querySelectorAll('.kanban-tasks').forEach((column) => {
        column.classList.remove('bg-body-tertiary');
      });
    });
  });

  document.querySelectorAll('.kanban-tasks').forEach((column) => {
    column.addEventListener('dragover', function (event) {
      event.preventDefault();
      if (!draggedTask) return;
      column.classList.add('bg-body-tertiary');
    });

    column.addEventListener('dragleave', function () {
      column.classList.remove('bg-body-tertiary');
    });

    column.addEventListener('drop', function (event) {
      event.preventDefault();
      if (!draggedTask) return;

      column.appendChild(draggedTask);
      column.classList.remove('bg-body-tertiary');

      const statusForm = draggedTask.querySelector('.tristate-form');
      let newStatus = column.parentElement.dataset.status;
      let statusInput = statusForm.querySelector('.tristate-hidden-input');
      statusInput.value = newStatus;

      statusForm.submit();
    });
  });
}
