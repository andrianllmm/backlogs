export default function setupKanban() {
  let draggedTask = null;
  let offsetX = 0;
  let offsetY = 0;

  document.querySelectorAll('.kanban-task').forEach((task) => {
    task.setAttribute('draggable', 'true');

    // Desktop Drag Events

    // Begin dragging (mark task and set drag data)
    task.addEventListener('dragstart', function (event) {
      setTimeout(() => task.classList.add('dragging'), 0);
      draggedTask = event.target;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    });

    // End dragging (unmark task and clear drag data)
    task.addEventListener('dragend', function () {
      draggedTask.classList.remove('dragging');
      draggedTask = null;
    });

    // Desktop Drop Events

    document.querySelectorAll('.kanban-tasks').forEach((column) => {
      // On drag over (highlight column)
      column.addEventListener('dragover', function (event) {
        event.preventDefault();
        if (!draggedTask) return;
        column.classList.add('bg-body-tertiary');
      });

      // On drag leave (remove highlight)
      column.addEventListener('dragleave', function () {
        column.classList.remove('bg-body-tertiary');
      });

      // On drop (append task to column and change status)
      column.addEventListener('drop', function (event) {
        event.preventDefault();
        if (!draggedTask) return;
        column.appendChild(draggedTask);
        column.classList.remove('bg-body-tertiary');

        // Change task status and submit the update form
        const statusForm = draggedTask.querySelector('.tristate-form');
        const statusInput = statusForm.querySelector('.tristate-hidden-input');
        const newStatus = column.parentElement.dataset.status;
        statusInput.value = newStatus;
        statusForm.submit();
      });
    });

    // Mobile Touch Events

    // Touch start (mark task and store touch offset)
    task.addEventListener('touchstart', function (event) {
      draggedTask = task;
      task.classList.add('dragging');
      const touch = event.touches[0];
      const rect = task.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    });

    // Touch move (move task to touch position)
    task.addEventListener('touchmove', function (event) {
      if (!draggedTask) return;
      event.preventDefault(); // Stop page scrolling

      const touch = event.touches[0];
      draggedTask.style.position = 'absolute';
      draggedTask.style.zIndex = '1000';
      draggedTask.style.left = touch.clientX - offsetX + 'px';
      draggedTask.style.top = touch.clientY - offsetY + 'px';

      // Highlight the column under the current touch position
      let targetElem = document.elementFromPoint(touch.clientX, touch.clientY);
      document.querySelectorAll('.kanban-tasks').forEach((col) => {
        if (targetElem && (targetElem === col || col.contains(targetElem))) {
          col.classList.add('bg-body-tertiary');
        } else {
          col.classList.remove('bg-body-tertiary');
        }
      });
    });

    // Touch end (unmark task and clear touch offset)
    task.addEventListener('touchend', function (event) {
      if (!draggedTask) return;
      draggedTask.classList.remove('dragging');

      // Clear temporary styles
      draggedTask.style.position = '';
      draggedTask.style.zIndex = '';
      draggedTask.style.left = '';
      draggedTask.style.top = '';

      // Identify drop target based on touch location
      const touch = event.changedTouches[0];
      let dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      dropTarget = dropTarget ? dropTarget.closest('.kanban-tasks') : null;

      if (dropTarget) {
        dropTarget.appendChild(draggedTask);
        dropTarget.classList.remove('bg-body-tertiary');

        // Change task status and submit the update form
        const statusForm = draggedTask.querySelector('.tristate-form');
        const statusInput = statusForm.querySelector('.tristate-hidden-input');
        const newStatus = dropTarget.parentElement.dataset.status;
        statusInput.value = newStatus;
        statusForm.submit();
      }

      draggedTask = null;
    });
  });
}
