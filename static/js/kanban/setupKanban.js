export default function setupKanban() {
  let draggedTask = null;
  let offsetX = 0;
  let offsetY = 0;

  // Helper function to update task status via Ajax
  function updateTaskStatus(statusForm) {
    const formData = new FormData(statusForm);
    const statusInput = statusForm.querySelector('.tristate-hidden-input');
    const checkbox = statusForm.querySelector('.tristate-checkbox');

    fetch(statusForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': statusForm.querySelector(
          'input[name="csrfmiddlewaretoken"]'
        ).value,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          let newStatus = parseInt(data.new_status, 10);
          checkbox.checked = newStatus === 2;
          checkbox.indeterminate = newStatus === 1;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          statusInput.value = newStatus;
        } else if (data.errors) {
          console.error('Update failed:', data.errors);
        }
      })
      .catch((error) => console.error('Error:', error));
  }

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

    // Desktop Drop Events on Columns

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

        const statusForm = draggedTask.querySelector('.tristate-form');
        if (statusForm) {
          const statusInput = statusForm.querySelector(
            '.tristate-hidden-input'
          );
          const newStatus = column.parentElement.dataset.status;
          if (newStatus !== statusInput.value) {
            statusInput.value = newStatus;
            updateTaskStatus(statusForm);
          }
        }
      });
    });

    // Desktop Drop Events on Tabs

    document.querySelectorAll('.kanban-column-tab').forEach((tab) => {
      // On drag over (highlight tab)
      tab.addEventListener('dragover', function (event) {
        event.preventDefault();
        if (!draggedTask) return;
        tab.classList.add('text-primary');
      });
      // On drag leave (remove highlight)
      tab.addEventListener('dragleave', function () {
        tab.classList.remove('text-primary');
      });
      // On drop (append task to column and change status)
      tab.addEventListener('drop', function (event) {
        event.preventDefault();
        if (!draggedTask) return;
        tab.classList.remove('text-primary');

        const statusForm = draggedTask.querySelector('.tristate-form');
        if (statusForm) {
          const statusInput = statusForm.querySelector(
            '.tristate-hidden-input'
          );
          const newStatus = tab.dataset.status;
          if (newStatus !== statusInput.value) {
            statusInput.value = newStatus;
            updateTaskStatus(statusForm);
          }
        }
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
      // Highlight the tab under the current touch position
      document.querySelectorAll('.kanban-column-tab').forEach((tab) => {
        if (targetElem && (targetElem === tab || tab.contains(targetElem))) {
          tab.classList.add('text-primary');
        } else {
          tab.classList.remove('text-primary');
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

      const touch = event.changedTouches[0];
      let targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );
      let kanbanTabTarget = targetElement
        ? targetElement.closest('.kanban-column-tab')
        : null;
      let kanbanTasksTarget = targetElement
        ? targetElement.closest('.kanban-tasks')
        : null;

      if (kanbanTabTarget) {
        const targetColumn = document.querySelector(
          `.kanban-tasks[data-status="${kanbanTabTarget.dataset.status}"]`
        );
        if (targetColumn) {
          targetColumn.appendChild(draggedTask);
        }

        const statusForm = draggedTask.querySelector('.tristate-form');
        if (statusForm) {
          const statusInput = statusForm.querySelector(
            '.tristate-hidden-input'
          );
          const newStatus = kanbanTabTarget.dataset.status;
          if (newStatus !== statusInput.value) {
            statusInput.value = newStatus;
            updateTaskStatus(statusForm);
          }
        }
      }

      if (kanbanTasksTarget) {
        kanbanTasksTarget.appendChild(draggedTask);
        kanbanTasksTarget.classList.remove('bg-body-tertiary');

        const statusForm = draggedTask.querySelector('.tristate-form');
        if (statusForm) {
          const statusInput = statusForm.querySelector(
            '.tristate-hidden-input'
          );
          const newStatus = kanbanTasksTarget.parentElement.dataset.status;
          if (newStatus !== statusInput.value) {
            statusInput.value = newStatus;
            updateTaskStatus(statusForm);
          }
        }
      }

      draggedTask = null;
    });
  });
}
