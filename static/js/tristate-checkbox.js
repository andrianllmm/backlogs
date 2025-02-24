export default function tristateCheckbox() {
  document.querySelectorAll('.tristate-checkbox').forEach((checkbox) => {
    const form = checkbox.closest('.tristate-form');
    const hiddenInput = checkbox.previousElementSibling;
    let status = parseInt(checkbox.dataset.initialStatus, 10) || 0;

    function updateCheckbox() {
      checkbox.checked = status == 2;
      checkbox.indeterminate = status == 1;
    }

    hiddenInput.addEventListener('change', function () {
      updateCheckbox();
    });

    checkbox.addEventListener('click', function (event) {
      status = (status + 1) % 3;
      hiddenInput.value = status;
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));

      if (form) form.submit();
    });

    updateCheckbox();
  });
}
