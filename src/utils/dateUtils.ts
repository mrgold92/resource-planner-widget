import { FirstDayOfWeek, PlannerDay } from "../types";

const WEEKDAY_LABELS_MONDAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_LABELS_SUNDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function startOfLocalDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function localDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function monthLabel(date: Date): string {
    return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(date);
}

export function getMonthDays(anchor: Date, firstDayOfWeek: FirstDayOfWeek, showWeekends: boolean): PlannerDay[] {
    const year = anchor.getFullYear();
    const month = anchor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey = localDateKey(new Date());

    return Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(year, month, index + 1);
        const weekday = date.getDay();
        const isWeekend = weekday === 0 || weekday === 6;

        return {
            date,
            dateKey: localDateKey(date),
            dayOfMonth: index + 1,
            weekdayLabel: weekdayLabel(weekday, firstDayOfWeek),
            isToday: localDateKey(date) === todayKey,
            isWeekend
        };
    }).filter(day => showWeekends || !day.isWeekend);
}

function weekdayLabel(jsWeekday: number, firstDayOfWeek: FirstDayOfWeek): string {
    if (firstDayOfWeek === "sunday") {
        return WEEKDAY_LABELS_SUNDAY[jsWeekday];
    }

    return WEEKDAY_LABELS_MONDAY[jsWeekday === 0 ? 6 : jsWeekday - 1];
}
