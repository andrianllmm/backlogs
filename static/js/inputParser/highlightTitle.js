export default function highlightTitle(
  title,
  matches,
  highlightClassname = 'bg-primary rounded'
) {
  const highlightedTitle = document.createDocumentFragment();
  let lastIndex = 0;

  matches.forEach(({ match, type }) => {
    switch (type) {
      case 'low':
        highlightClassname = 'bg-info rounded';
        break;
      case 'medium':
        highlightClassname = 'bg-warning rounded';
        break;
      case 'high':
        highlightClassname = 'bg-danger rounded';
        break;
      default:
        highlightClassname = 'bg-primary rounded';
        break;
    }

    const matchedText = match[0];

    if (match.index > lastIndex) {
      const beforeText = title.substring(lastIndex, match.index);
      highlightedTitle.appendChild(document.createTextNode(beforeText));
    }

    const keywordSpan = document.createElement('span');
    keywordSpan.className = highlightClassname;
    keywordSpan.textContent = matchedText;
    highlightedTitle.appendChild(keywordSpan);

    lastIndex = match.index + matchedText.length;
  });

  if (lastIndex < title.length) {
    highlightedTitle.appendChild(
      document.createTextNode(title.substring(lastIndex))
    );
  }

  return highlightedTitle;
}
