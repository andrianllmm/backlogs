import parseInput from './inputParser/parseInput.js';
import setupKanban from './kanban/setupKanban.js';

document.addEventListener('DOMContentLoaded', function () {
  parseInput();
  setupKanban();
});
