export default function persistKanbanTabs() {
  const kanbanContainerMobile = document.querySelector(
    '.kanban-container-mobile'
  );
  if (!kanbanContainerMobile) return;

  const tabHeaders = document.querySelectorAll('.kanban-col-header-tab');
  const tabPanes = document.querySelectorAll('.kanban-tab-pane');

  // On page load, check the URL hash and activate the corresponding tab
  const activeIndex = window.location.hash
    ? window.location.hash.replace('#', '').replace('column-', '')
    : null;

  if (activeIndex) {
    // Deactivate all tabs
    tabHeaders.forEach((tab) => tab.classList.remove('active'));
    tabPanes.forEach((content) => content.classList.remove('show', 'active'));

    // Activate the corresponding tab and content
    const activeTab = document.querySelector(
      `.kanban-col-header-tab[data-status="${activeIndex}"]`
    );
    const activePane = document.querySelector(
      `.kanban-tab-pane[data-status="${activeIndex}"]`
    );

    activeTab.classList.add('active');
    activePane.classList.add('show', 'active');
  } else {
    // Default to the first tab if no hash
    tabHeaders[0].classList.add('active');
    tabPanes[0].classList.add('show', 'active');
  }

  // Update the URL hash when a tab is clicked
  tabHeaders.forEach((tabHeader) => {
    tabHeader.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent page reload on tab click
      const status = tabHeader.dataset.status;

      // Deactivate all tabs
      tabHeaders.forEach((tab) => tab.classList.remove('active'));
      tabPanes.forEach((content) => content.classList.remove('show', 'active'));

      // Activate the clicked tab and corresponding content
      tabHeader.classList.add('active');
      const activeTabContent = document.querySelector(
        `.kanban-tab-pane[data-status="${status}"]`
      );
      activeTabContent.classList.add('show', 'active');

      // Update the URL hash
      window.location.hash = `column-${status}`;
    });
  });
}
