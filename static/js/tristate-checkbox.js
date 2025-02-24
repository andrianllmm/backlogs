export default function tristateCheckbox() {
  document.querySelectorAll('.tristate-checkbox').forEach((checkbox) => {
    const form = checkbox.closest('.tristate-form');
    const hiddenInput = checkbox.previousElementSibling;
    let status = parseInt(checkbox.dataset.initialStatus, 10) || 0;

    function updateCheckbox() {
      checkbox.checked = status === 2;
      checkbox.indeterminate = status === 1;
    }

    function moveTaskToColumn() {
      const task = checkbox.closest('.kanban-task');
      const newStatus = status;
      let targetColumn;

      document.querySelectorAll('.kanban-tasks').forEach((column) => {
        if (column.parentElement.dataset.status == newStatus) {
          targetColumn = column;
        }
      });

      if (targetColumn && task) {
        targetColumn.appendChild(task);
      }
    }

    hiddenInput.addEventListener('change', function () {
      updateCheckbox();
    });

    checkbox.addEventListener('click', function (event) {
      status = (status + 1) % 3;
      hiddenInput.value = status;
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));

      if (form) {
        const formData = new FormData(form);
        fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': form.querySelector(
              'input[name="csrfmiddlewaretoken"]'
            ).value,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              status = parseInt(data.new_status, 10);
              updateCheckbox();
              moveTaskToColumn();
            } else if (data.errors) {
              console.error('Update failed:', data.errors);
            }
          })
          .catch((error) => console.error('Error:', error));
      } else {
        updateCheckbox();
        moveTaskToColumn();
      }
    });

    updateCheckbox();
  });
}
