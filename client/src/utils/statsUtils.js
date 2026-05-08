/**
 * Calculates the percentage change between current month and previous month
 * @param {Array} items - Array of objects with createdAt property
 * @returns {number} - Percentage change (rounded to 1 decimal place)
 */
export function calculateMonthOverMonthChange(items) {
    if (!items || items.length === 0) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
    const firstDayPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0);

    const currentMonthItems = items.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= firstDayCurrentMonth;
    }).length;

    const prevMonthItems = items.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= firstDayPrevMonth && itemDate <= lastDayPrevMonth;
    }).length;

    if (prevMonthItems === 0) {
        return currentMonthItems > 0 ? 100 : 0;
    }

    const change = ((currentMonthItems - prevMonthItems) / prevMonthItems) * 100;
    return Math.round(change * 10) / 10;
}
