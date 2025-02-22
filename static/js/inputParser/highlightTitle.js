export default function highlightTitle(title, matches) {
  const highlightedTitle = document.createDocumentFragment();
  const highlightClassname = 'bg-primary rounded';
  let lastIndex = 0;

  matches.forEach(({ match }) => {
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
