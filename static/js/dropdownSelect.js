export default function dropdownSelect() {
  document.querySelectorAll('.dropdown-select').forEach((dropdown) => {
    const hiddenInput = document.getElementById(dropdown.dataset.inputId);
    const buttonText = dropdown.querySelector('.selected-text');
    const items = dropdown.querySelectorAll('.dropdown-item');

    if (!hiddenInput || !buttonText) return;

    function updateDropdownUI(value) {
      const selectedItem = dropdown.querySelector(
        `.dropdown-item[data-value="${value}"]`
      );
      if (selectedItem) {
        buttonText.innerHTML = selectedItem.innerHTML;
        items.forEach((item) => item.removeAttribute('aria-selected'));
        selectedItem.setAttribute('aria-selected', 'true');
      }
    }

    dropdown.addEventListener('click', function (event) {
      const item = event.target.closest('.dropdown-item');
      if (!item) return;

      hiddenInput.value = item.dataset.value;
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    hiddenInput.addEventListener('change', function () {
      updateDropdownUI(this.value);
    });

    if (hiddenInput.value) updateDropdownUI(hiddenInput.value);
  });
}
