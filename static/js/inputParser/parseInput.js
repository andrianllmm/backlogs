import parseDate from './parseDate.js';
import { formatDatetimeLocal } from './formatDate.js';
import parsePriority from './parsePriority.js';
import highlightTitle from './highlightTitle.js';

export default function parseInput() {
  const form = document.querySelector('#add-task-form');
  const titleInput = document.querySelector('#add-task-title-field');
  const overlay = document.querySelector('#add-task-title-field-overlay');
  const dueDateInput = document.querySelector('#add-task-due-date-field');
  const prioritySelect = document.querySelector('#add-task-priority-field');

  titleInput.addEventListener('input', function () {
    const title = titleInput.value;

    const { parsedDate, matches: dateMatches } = parseDate(
      title,
      dueDateInput.value
    );
    const { parsedPriority, match: priorityMatch } = parsePriority(
      title,
      prioritySelect.value
    );

    prioritySelect.value = parsedPriority;
    dueDateInput.value =
      parsedDate instanceof Date && !isNaN(parsedDate)
        ? formatDatetimeLocal(parsedDate)
        : '';

    overlay.innerHTML = '';

    const allMatches = [
      ...dateMatches,
      ...(priorityMatch ? [priorityMatch] : []),
    ];

    const highlightedTitle = highlightTitle(title, allMatches);

    overlay.appendChild(
      typeof highlightedTitle === 'string'
        ? document.createTextNode(highlightedTitle)
        : highlightedTitle
    );
  });

  form.addEventListener('submit', function () {
    const { trueTitle } = parseDate(titleInput.value, dueDateInput.value);
    const { trueTitle: trueTitleWithPriority } = parsePriority(
      trueTitle,
      prioritySelect.value
    );
    titleInput.value = trueTitleWithPriority;
    overlay.innerHTML = '';
  });
}
