export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateMonthDays(
  year: number,
  month: number,
  moodData: Record<string, number>,
  today: Date
) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }).map((_, index) => {
    const date = new Date(year, month, index + 1);
    const dayKey = toDateKey(date);
    const moodValue = moodData[dayKey];
    const isToday = date.toDateString() === today.toDateString();

    return {
      date,
      dayKey,
      moodValue,
      isToday,
    };
  });
}