export default function datepicker() {
  document.querySelectorAll('.datepicker-input').forEach((datepicker) => {
    const textId = datepicker.getAttribute('data-text-id');
    const textElement = document.getElementById(textId);

    if (!textElement) return;

    function updateText() {
      const selectedDate = new Date(datepicker.value);
      if (isNaN(selectedDate)) {
        textElement.textContent = 'Date';
        return;
      }

      const now = new Date();
      const day = selectedDate.getDate();
      const month = selectedDate.toLocaleString('en-US', { month: 'short' });
      const year =
        selectedDate.getFullYear() !== now.getFullYear()
          ? `'${selectedDate.getFullYear().toString().slice(-2)}`
          : '';
      const time = selectedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      textElement.textContent = `${day} ${month} ${year} ${time}`.trim();
    }

    datepicker.addEventListener('change', updateText);
    datepicker.addEventListener('input', updateText);

    if (datepicker.value) updateText();
  });
}
