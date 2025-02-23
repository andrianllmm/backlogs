export default function parsePriority(title, defaultPriority = 0) {
  let parsedPriority = defaultPriority;
  let trueTitle = title;
  let matches = [];

  const keywords = [
    { regex: /(?<!\S)!(low)(?!\S)/gi, type: 'low' },
    { regex: /(?<!\S)!(medium|mid)(?!\S)/gi, type: 'medium' },
    { regex: /(?<!\S)!(high)(?!\S)/gi, type: 'high' },
  ];

  keywords.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(title)) !== null) {
      matches.push({ match, type });
    }
  });

  matches.sort((a, b) => a.match.index - b.match.index);

  matches.forEach(({ match, type }) => {
    trueTitle = trueTitle.replace(match[0], '').trim();

    switch (type) {
      case 'low':
        parsedPriority = 0;
        break;
      case 'medium':
        parsedPriority = 1;
        break;
      case 'high':
        parsedPriority = 2;
        break;
    }
  });

  return { parsedPriority, trueTitle, match: matches ? matches[0] : null };
}
