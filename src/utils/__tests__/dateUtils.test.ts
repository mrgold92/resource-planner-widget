import { getMonthDays, localDateKey, monthLabel, startOfLocalDay } from "../dateUtils";

describe("dateUtils", () => {
    it("creates one column per day in the visible month", () => {
        const days = getMonthDays(new Date(2026, 4, 12), "monday", true);

        expect(days).toHaveLength(31);
        expect(days[0].dateKey).toBe("2026-05-01");
        expect(days[30].dateKey).toBe("2026-05-31");
    });

    it("can hide weekend columns", () => {
        const days = getMonthDays(new Date(2026, 4, 1), "monday", false);

        expect(days).toHaveLength(21);
        expect(days.some(day => day.isWeekend)).toBe(false);
    });

    it("formats local date keys without timezone conversion", () => {
        expect(localDateKey(new Date(2026, 0, 5, 23, 45))).toBe("2026-01-05");
    });

    it("normalizes dates to the start of local day", () => {
        const normalized = startOfLocalDay(new Date(2026, 7, 9, 14, 30));

        expect(normalized.getFullYear()).toBe(2026);
        expect(normalized.getMonth()).toBe(7);
        expect(normalized.getDate()).toBe(9);
        expect(normalized.getHours()).toBe(0);
        expect(normalized.getMinutes()).toBe(0);
    });

    it("formats month labels in English", () => {
        expect(monthLabel(new Date(2026, 4, 1))).toBe("May 2026");
    });
});
