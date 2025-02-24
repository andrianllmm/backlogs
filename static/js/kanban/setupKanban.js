export default function setupKanban() {
  let draggedTask = null;
  let offsetX = 0;
  let offsetY = 0;
  const highlightTasksClass = 'bg-body-tertiary';
  const highlightTabClass = 'text-primary';

  // Helper function to update task status via Ajax
  function updateTaskStatus(statusForm) {
    if (!statusForm) return;

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
          const newStatus = parseInt(data.new_status, 10);
          checkbox.checked = newStatus === 2;
          checkbox.indeterminate = newStatus === 1;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          statusInput.value = newStatus;
        } else if (data.errors) {
          console.error('Task status update failed:', data.errors);
        }
      })
      .catch((error) => console.error('Error:', error));
  }

  document.querySelectorAll('.kanban-task').forEach((task) => {
    task.setAttribute('draggable', 'true');

    // Desktop Drag Events

    // Begin dragging (mark task and set drag data)
    task.addEventListener('dragstart', function (event) {
      draggedTask = event.target;
      setTimeout(() => task.classList.add('dragging'), 0);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    });

    // End dragging (unmark task and clear drag data)
    task.addEventListener('dragend', function () {
      if (!draggedTask) return;
      draggedTask.classList.remove('dragging');
      draggedTask = null;
    });

    // Desktop Drop Events on Columns

    document.querySelectorAll('.kanban-tasks').forEach((taskList) => {
      // On drag over (highlight column)
      taskList.addEventListener('dragover', function (event) {
        event.preventDefault();
        if (!draggedTask) return;
        taskList.classList.add(highlightTasksClass);
      });

      // On drag leave (remove highlight)
      taskList.addEventListener('dragleave', function () {
        taskList.classList.remove(highlightTasksClass);
      });

      // On drop (append task to column and change status)
      taskList.addEventListener('drop', function (event) {
        event.preventDefault();
        if (!draggedTask) return;

        taskList.classList.remove(highlightTasksClass);
        taskList.appendChild(draggedTask);

        const statusForm = draggedTask.querySelector('.tristate-form');
        if (statusForm) {
          const statusInput = statusForm.querySelector(
            '.tristate-hidden-input'
          );
          const newStatus = taskList.dataset.status;
          if (newStatus !== statusInput.value) {
            statusInput.value = newStatus;
            updateTaskStatus(statusForm);
          }
        }
      });
    });

    // Desktop Drop Events on Tab Headers

    document.querySelectorAll('.kanban-col-header-tab').forEach((tabHeader) => {
      // On drag over (highlight tab)
      tabHeader.addEventListener('dragover', function (event) {
        event.preventDefault();
        if (!draggedTask) return;
        tabHeader.classList.add(highlightTabClass);
      });

      // On drag leave (remove highlight)
      tabHeader.addEventListener('dragleave', function () {
        tabHeader.classList.remove(highlightTabClass);
      });

      // On drop (append task to column and change status)
      tabHeader.addEventListener('drop', function (event) {
        event.preventDefault();
        if (!draggedTask) return;

        tabHeader.classList.remove(highlightTabClass);

        const statusForm = draggedTask.querySelector('.tristate-form');
        if (statusForm) {
          const statusInput = statusForm.querySelector(
            '.tristate-hidden-input'
          );
          const newStatus = tabHeader.dataset.status;
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
      document.querySelectorAll('.kanban-tasks').forEach((taskList) => {
        if (
          targetElem &&
          (targetElem === taskList || taskList.contains(targetElem))
        ) {
          taskList.classList.add(highlightTasksClass);
        } else {
          taskList.classList.remove(highlightTasksClass);
        }
      });
      // Highlight the tab under the current touch position
      document
        .querySelectorAll('.kanban-col-header-tab')
        .forEach((tabHeader) => {
          if (
            targetElem &&
            (targetElem === tabHeader || tabHeader.contains(targetElem))
          ) {
            tabHeader.classList.add(highlightTabClass);
          } else {
            tabHeader.classList.remove(highlightTabClass);
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
      let targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );

      let kanbanTabTarget = targetElement
        ? targetElement.closest('.kanban-col-header-tab')
        : null;
      let kanbanTasksTarget = targetElement
        ? targetElement.closest('.kanban-tasks')
        : null;

      // If task is dropped on a tab header
      if (kanbanTabTarget) {
        kanbanTabTarget.classList.remove(highlightTabClass);
        const targetTasklist = document.querySelector(
          `.kanban-tasks[data-status="${kanbanTabTarget.dataset.status}"]`
        );

        if (targetTasklist) {
          targetTasklist.appendChild(draggedTask);

          const statusForm = draggedTask.querySelector('.tristate-form');
          if (statusForm) {
            const statusInput = statusForm.querySelector(
              '.tristate-hidden-input'
            );
            const newStatus = kanbanTabTarget.dataset.status;
            if (newStatus !== statusInput.value) {
              statusInput.value = newStatus;
              updateTaskStatus(statusForm, newStatus);
            }
          }
        }
      }
      // If task is dropped on a task list
      else if (kanbanTasksTarget) {
        kanbanTasksTarget.classList.remove(highlightTasksClass);
        kanbanTasksTarget.appendChild(draggedTask);

        const statusForm = draggedTask.querySelector('.tristate-form');
        if (statusForm) {
          const statusInput = statusForm.querySelector(
            '.tristate-hidden-input'
          );
          const newStatus = kanbanTasksTarget.dataset.status;
          if (newStatus !== statusInput.value) {
            statusInput.value = newStatus;
            updateTaskStatus(statusForm, newStatus);
          }
        }
      }

      draggedTask = null;
    });
  });
}
