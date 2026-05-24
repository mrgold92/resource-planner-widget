import { ReactElement } from "react";
import { ObjectItem } from "mendix";
import { PlannerGrid } from "./components/PlannerGrid";
import { PlannerEntry, PlannerResource } from "./types";
import { getMonthDays, localDateKey, monthLabel } from "./utils/dateUtils";
import { indexEntriesByCell } from "./utils/plannerIndex";

import "./ui/Resourceplannerwidget.css";

export function preview(): ReactElement {
    const anchor = new Date(2026, 4, 1);
    const days = getMonthDays(anchor, "monday", true);
    const resources: PlannerResource[] = [
        { id: "resource-1", title: "Consultant team", subtitle: "4 people", item: mockItem("resource-1") },
        { id: "resource-2", title: "Installation crew", subtitle: "North region", item: mockItem("resource-2") },
        { id: "resource-3", title: "Support desk", subtitle: "Rotating shift", item: mockItem("resource-3") }
    ];
    const entries: PlannerEntry[] = [
        entry("entry-1", "resource-1", new Date(2026, 4, 4), "Kickoff", "Madrid", "rpw-entry-blue"),
        entry("entry-2", "resource-1", new Date(2026, 4, 4), "Workshop", "Remote", "rpw-entry-green"),
        entry("entry-3", "resource-2", new Date(2026, 4, 11), "On-site install", "08:00", "rpw-entry-amber"),
        entry("entry-4", "resource-3", new Date(2026, 4, 18), "Coverage", "AM shift", "rpw-entry-blue")
    ];

    return (
        <PlannerGrid
            monthLabel={monthLabel(anchor)}
            days={days}
            resources={resources}
            entriesByCell={indexEntriesByCell(entries)}
            isEntriesEmpty={false}
            isLoadingEntries={false}
            resourceColumnWidth={220}
            dayColumnMinWidth={128}
            visibleResourceRows={8}
            heightMode="auto"
            onResourceClick={() => undefined}
            onEntryClick={() => undefined}
            onEmptyCellClick={() => undefined}
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/Resourceplannerwidget.css");
}

function entry(
    id: string,
    resourceId: string,
    date: Date,
    title: string,
    subtitle: string,
    colorClass: string
): PlannerEntry {
    return {
        id,
        item: mockItem(id),
        resourceId,
        date,
        dateKey: localDateKey(date),
        title,
        subtitle,
        colorClass
    };
}

function mockItem(id: string): ObjectItem {
    return { id } as unknown as ObjectItem;
}
