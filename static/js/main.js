import parseInput from './inputParser/parseInput.js';
import setupKanban from './kanban/setupKanban.js';
import tristateCheckbox from './tristate-checkbox.js';
import dropdownSelect from './dropdownSelect.js';
import datepicker from './datepicker.js';
import handleThemeToggle from './handleThemeToggle.js';
import persistKanbanTabs from './kanban/persistKanbanTabs.js';

document.addEventListener('DOMContentLoaded', function () {
  parseInput();
  setupKanban();
  persistKanbanTabs();
  tristateCheckbox();
  dropdownSelect();
  datepicker();
  handleThemeToggle();
});
