export function formatDatetimeLocal(date) {
  const localDate = new Date(date - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}
