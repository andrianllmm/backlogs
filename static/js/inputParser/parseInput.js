import parseDate from './parseDate.js';
import { formatDatetimeLocal } from './formatDate.js';
import highlightTitle from './highlightTitle.js';

export default function parseInput() {
  const form = document.querySelector('#add-task-form');
  const titleInput = document.querySelector('#add-task-title-field');
  const overlay = document.querySelector('#add-task-title-field-overlay');
  const dueDateInput = document.querySelector('#add-task-due-date-field');

  titleInput.addEventListener('input', function () {
    const title = titleInput.value;
    const { parsedDate, matches } = parseDate(title, dueDateInput.value);

    dueDateInput.value =
      parsedDate instanceof Date && !isNaN(parsedDate)
        ? formatDatetimeLocal(parsedDate)
        : '';

    overlay.innerHTML = '';
    overlay.appendChild(highlightTitle(title, matches));
  });

  form.addEventListener('submit', function () {
    const { trueTitle } = parseDate(titleInput.value, dueDateInput.value);
    titleInput.value = trueTitle;
    overlay.innerHTML = '';
  });
}
