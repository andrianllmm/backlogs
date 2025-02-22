export default function parseDate(title, defaultDate) {
  let parsedDate = defaultDate instanceof Date ? defaultDate : null;
  let trueTitle = title;
  let matches = [];

  const keywords = [
    { regex: /\b(today|tdy)\b/gi, type: 'today' },
    { regex: /\b(tomorrow|tmr)\b/gi, type: 'tomorrow' },
    {
      regex:
        /\b(?:(?:after(?:\s+a)?|next)\s+)(\d{1,2}\s+)?(day|week|month|year)s?\b/gi,
      type: 'relative',
    },
    {
      regex:
        /\b(?:(on|this|next)\s+)?(sunday|sun|monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat)\b/gi,
      type: 'dayOfWeek',
    },
    {
      regex:
        /\b(?:on\s+)?(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|october|oct|november|nov|december|dec)(\s+\d{1,2})?\b/gi,
      type: 'specificDate',
    },
    {
      regex: /(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)?\b/gi,
      type: 'time',
    },
    {
      regex:
        /\b(?:(in|at|this|during|next)\s+)?(?:the\s+)?(morning|noon|afternoon|evening|midnight)\b/gi,
      type: 'generalTime',
    },
  ];

  keywords.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(title)) !== null) {
      if (type === 'time' && !match[2] && !match[3]) continue;
      matches.push({ match, type });
    }
  });

  matches.sort((a, b) => a.match.index - b.match.index);

  matches.forEach(({ match, type }) => {
    trueTitle = trueTitle.replace(match[0], '').trim();

    switch (type) {
      case 'today':
      case 'tomorrow':
        const newDate = new Date();
        if (!parsedDate) {
          newDate.setHours(23, 59, 59, 999);
        } else {
          newDate.setHours(
            parsedDate?.getHours() || 0,
            parsedDate?.getMinutes() || 0,
            0,
            0
          );
        }
        if (type === 'tomorrow') newDate.setDate(newDate.getDate() + 1);
        parsedDate = newDate;
        break;
      case 'relative':
        parsedDate = handleRelative(match, parsedDate);
        break;
      case 'dayOfWeek':
        parsedDate = handleDayOfWeek(match, parsedDate);
        break;
      case 'specificDate':
        parsedDate = handleSpecificDate(match, parsedDate);
        break;
      case 'time':
        parsedDate = handleTime(match, parsedDate);
        break;
      case 'generalTime':
        parsedDate = handleGeneralTime(match, parsedDate);
        break;
    }
  });

  return { parsedDate, trueTitle, matches };
}

export function handleRelative(match, parsedDate) {
  const now = new Date();
  const newDate = new Date(now);
  if (!parsedDate) {
    newDate.setHours(23, 59, 59, 999);
  } else {
    newDate.setHours(parsedDate.getHours(), parsedDate.getMinutes(), 0, 0);
  }

  const amount = match[1] ? parseInt(match[1]?.trim(), 10) : 1;
  switch (match[2]?.trim().toLowerCase()) {
    case 'day':
      newDate.setDate(now.getDate() + amount);
      break;
    case 'week':
      newDate.setDate(now.getDate() + amount * 7);
      break;
    case 'month':
      newDate.setMonth(now.getMonth() + amount);
      break;
    case 'year':
      newDate.setFullYear(now.getFullYear() + amount);
      break;
  }
  return newDate;
}

export function handleDayOfWeek(match, parsedDate) {
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const now = new Date();
  const newDate = new Date(now);
  if (!parsedDate) {
    newDate.setHours(23, 59, 59, 999);
  } else {
    newDate.setHours(parsedDate.getHours(), parsedDate.getMinutes(), 0, 0);
  }

  const isNext = match[1]?.trim() === 'next';
  const targetDay = daysOfWeek.findIndex((day) =>
    match[2]?.trim().toLowerCase().startsWith(day)
  );

  let daysToAdd = (targetDay - now.getDay() + 7) % 7;
  if (isNext) daysToAdd += 7;
  newDate.setDate(now.getDate() + daysToAdd);

  return newDate;
}

export function handleSpecificDate(match, parsedDate) {
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];

  const now = new Date();
  const newDate = new Date(now);
  if (!parsedDate) {
    newDate.setHours(23, 59, 59, 999);
  } else {
    newDate.setHours(parsedDate.getHours(), parsedDate.getMinutes(), 0, 0);
  }

  const targetMonth = months.findIndex((month) =>
    match[1]?.trim().toLowerCase().startsWith(month)
  );
  const day = match[2] ? parseInt(match[2]?.trim(), 10) : now.getDate();

  newDate.setMonth(targetMonth, day);
  if (newDate < now) newDate.setFullYear(now.getFullYear() + 1);

  return newDate;
}

export function handleTime(match, parsedDate) {
  if (!match[1]) return parsedDate;

  const now = new Date();
  const newDate = new Date(parsedDate || now);
  let hours = parseInt(match[1].trim(), 10);
  const minutes = match[2] ? parseInt(match[2].trim(), 10) : 0;
  const ampm = match[3]?.trim()?.toUpperCase();

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  if (!ampm && hours < now.getHours()) hours += 12;

  newDate.setHours(hours, minutes, 0, 0);

  if (!parsedDate && newDate <= now) newDate.setDate(newDate.getDate() + 1);

  return newDate;
}

export function handleGeneralTime(match, parsedDate) {
  const times = {
    morning: 9,
    noon: 12,
    afternoon: 13,
    evening: 17,
    midnight: 0,
  };

  const now = new Date();
  const newDate = new Date(parsedDate || now);
  const isNext = match[1]?.trim() === 'next';
  const hours = times[match[2].toLowerCase()];

  newDate.setHours(hours, 0, 0, 0);
  if (newDate < now || isNext) newDate.setDate(newDate.getDate() + 1);

  return newDate;
}
