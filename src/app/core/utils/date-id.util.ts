export class DateTimeUtil {
  // Returns YYYY-MM for the UTC month of the given date or timestamp.
  static toMonthId(date: Date | number): string {
    const dateObj = new Date(date);
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  // Returns YYYY-MM-DD for the UTC date of the given date or timestamp.
  static toDateId(date: Date | number): string {
    const dateObj = new Date(date);
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Converts a DateId (YYYY-MM-DD) to a Date (local time).
  static fromDateId(dateId: string): Date {
    const [year, month, day] = dateId.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
