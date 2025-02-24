export default function persistKanbanTabs() {
  const tabs = document.querySelectorAll('.kanban-column-tab');
  const tabContent = document.querySelectorAll('.tab-pane');

  // On page load, check the URL hash and activate the corresponding tab
  const activeTab = window.location.hash
    ? window.location.hash.replace('#', '').replace('column-', '')
    : null;

  if (activeTab) {
    // Deactivate all tabs
    tabs.forEach((tab) => tab.classList.remove('active'));
    tabContent.forEach((content) => content.classList.remove('show', 'active'));

    // Activate the corresponding tab and content
    const activeTabElement = document.querySelector(
      `#kanban-column-tab-${activeTab}`
    );
    const activeContentElement = document.querySelector(
      `#kanban-tab-content-${activeTab}`
    );

    activeTabElement.classList.add('active');
    activeContentElement.classList.add('show', 'active');
  } else {
    // If no hash is in the URL, default to the first tab
    tabs[0].classList.add('active');
    tabContent[0].classList.add('show', 'active');
  }

  // Update the URL hash when a tab is clicked
  tabs.forEach((tab) => {
    tab.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent page reload on tab click
      const status = tab.dataset.status;

      // Deactivate all tabs
      tabs.forEach((tab) => tab.classList.remove('active'));
      tabContent.forEach((content) =>
        content.classList.remove('show', 'active')
      );

      // Activate the clicked tab and corresponding content
      tab.classList.add('active');
      const activeTabContent = document.querySelector(
        `#kanban-tab-content-${status}`
      );
      activeTabContent.classList.add('show', 'active');

      // Update the URL hash
      window.location.hash = `column-${status}`;
    });
  });
}
