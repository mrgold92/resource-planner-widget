import { ReactElement } from "react";
import classNames from "classnames";
import { PlannerDay, PlannerEntry, PlannerResource } from "../types";
import { EmptyCellButton } from "./EmptyCellButton";
import { EntryCard } from "./EntryCard";

export interface DayCellProps {
    day: PlannerDay;
    resource: PlannerResource;
    entries: PlannerEntry[];
    isLoadingEntries: boolean;
    onEntryClick(entry: PlannerEntry): void;
    onEmptyCellClick(resource: PlannerResource, day: PlannerDay): void;
}

export function DayCell({
    day,
    resource,
    entries,
    isLoadingEntries,
    onEntryClick,
    onEmptyCellClick
}: DayCellProps): ReactElement {
    return (
        <div
            className={classNames("rpw-day-cell", {
                "rpw-day-cell-weekend": day.isWeekend,
                "rpw-day-cell-today": day.isToday,
                "rpw-day-cell-empty": entries.length === 0
            })}
            role="gridcell"
            aria-label={`${resource.title}, ${day.dateKey}`}
        >
            {isLoadingEntries ? (
                <div className="rpw-cell-skeleton" aria-hidden="true">
                    <span className="rpw-skeleton-line rpw-skeleton-line-main" />
                    <span className="rpw-skeleton-line rpw-skeleton-line-short" />
                </div>
            ) : entries.length > 0 ? (
                <div className="rpw-entry-stack">
                    {entries.map(entry => (
                        <EntryCard key={entry.id} entry={entry} onClick={onEntryClick} />
                    ))}
                </div>
            ) : (
                <EmptyCellButton day={day} resource={resource} onClick={onEmptyCellClick} />
            )}
        </div>
    );
}
