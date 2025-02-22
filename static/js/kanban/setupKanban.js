export default function setupKanban() {
  let draggedTask = null;

  document.querySelectorAll('.kanban-task').forEach((task) => {
    task.addEventListener('dragstart', function (event) {
      draggedTask = event.target;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    });

    task.addEventListener('dragend', function () {
      draggedTask = null;
      document.querySelectorAll('.kanban-tasks').forEach((column) => {
        column.classList.remove('bg-body-tertiary');
      });
    });
  });

  document.querySelectorAll('.kanban-tasks').forEach((column) => {
    column.addEventListener('dragover', function (event) {
      event.preventDefault();
      column.classList.add('bg-body-tertiary');
    });

    column.addEventListener('dragleave', function () {
      column.classList.remove('bg-body-tertiary');
    });

    column.addEventListener('drop', function (event) {
      event.preventDefault();
      if (draggedTask) {
        column.appendChild(draggedTask);

        let newStatus = column.parentElement.dataset.status;
        let form = draggedTask.querySelector('.status-form');
        let input = form.querySelector('.status-input');
        input.value = newStatus;
        form.submit();
      }

      column.classList.remove('bg-body-tertiary');
    });
  });
}
