import { fireEvent, render, screen } from "@testing-library/react";
import { ObjectItem } from "mendix";
import { PlannerGrid } from "../PlannerGrid";
import { PlannerEntry, PlannerResource } from "../../types";
import { getMonthDays, localDateKey } from "../../utils/dateUtils";
import { indexEntriesByCell } from "../../utils/plannerIndex";

describe("PlannerGrid", () => {
    it("renders resources and multiple entries in a cell", () => {
        renderPlanner();

        expect(screen.getByText("Consultant team")).not.toBeNull();
        expect(screen.getByText("Kickoff")).not.toBeNull();
        expect(screen.getByText("Workshop")).not.toBeNull();
    });

    it("executes resource, entry and empty-cell callbacks", () => {
        const onResourceClick = jest.fn();
        const onEntryClick = jest.fn();
        const onEmptyCellClick = jest.fn();

        renderPlanner({ onResourceClick, onEntryClick, onEmptyCellClick });

        fireEvent.click(screen.getByText("Consultant team"));
        fireEvent.click(screen.getByText("Kickoff"));
        fireEvent.click(screen.getByLabelText("Add entry for Consultant team on 2026-05-05"));

        expect(onResourceClick).toHaveBeenCalledTimes(1);
        expect(onEntryClick).toHaveBeenCalledTimes(1);
        expect(onEmptyCellClick).toHaveBeenCalledTimes(1);
    });

    it("shows loading placeholders instead of empty-cell actions while entries load", () => {
        const onEmptyCellClick = jest.fn();

        renderPlanner({ isLoadingEntries: true, onEmptyCellClick });

        expect(screen.getByText("Loading entries")).not.toBeNull();
        expect(screen.queryByLabelText("Add entry for Consultant team on 2026-05-05")).toBeNull();
    });
});

function renderPlanner(overrides: Partial<Parameters<typeof PlannerGrid>[0]> = {}): void {
    const anchor = new Date(2026, 4, 1);
    const days = getMonthDays(anchor, "monday", true);
    const resources: PlannerResource[] = [
        { id: "resource-1", title: "Consultant team", item: { id: "resource-1" } as unknown as ObjectItem }
    ];
    const entries: PlannerEntry[] = [
        entry("entry-1", "resource-1", new Date(2026, 4, 4), "Kickoff"),
        entry("entry-2", "resource-1", new Date(2026, 4, 4), "Workshop")
    ];

    render(
        <PlannerGrid
            monthLabel="May 2026"
            days={days}
            resources={resources}
            entriesByCell={indexEntriesByCell(entries)}
            isEntriesEmpty={false}
            isLoadingEntries={false}
            resourceColumnWidth={220}
            dayColumnMinWidth={128}
            visibleResourceRows={12}
            heightMode="auto"
            onResourceClick={() => undefined}
            onEntryClick={() => undefined}
            onEmptyCellClick={() => undefined}
            {...overrides}
        />
    );
}

function entry(id: string, resourceId: string, date: Date, title: string): PlannerEntry {
    return {
        id,
        resourceId,
        date,
        dateKey: localDateKey(date),
        title,
        item: { id } as unknown as ObjectItem
    };
}
