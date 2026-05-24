import { KeyboardEvent, ReactElement } from "react";
import { EntriesByCell, PlannerDay, PlannerEntry, PlannerResource } from "../types";
import { cellKey } from "../utils/plannerIndex";
import { DayCell } from "./DayCell";

export interface ResourceRowProps {
    resource: PlannerResource;
    days: PlannerDay[];
    entriesByCell: EntriesByCell;
    isLoadingEntries: boolean;
    onResourceClick(resource: PlannerResource): void;
    onEntryClick(entry: PlannerEntry): void;
    onEmptyCellClick(resource: PlannerResource, day: PlannerDay): void;
}

export function ResourceRow({
    resource,
    days,
    entriesByCell,
    isLoadingEntries,
    onResourceClick,
    onEntryClick,
    onEmptyCellClick
}: ResourceRowProps): ReactElement {
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onResourceClick(resource);
        }
    };

    return (
        <div className="rpw-resource-row" role="row">
            <button
                type="button"
                className="rpw-resource-cell"
                onClick={() => onResourceClick(resource)}
                onKeyDown={handleKeyDown}
                title={resource.title}
            >
                <span className="rpw-resource-title">{resource.title}</span>
                {resource.subtitle ? <span className="rpw-resource-subtitle">{resource.subtitle}</span> : null}
            </button>
            {days.map(day => (
                <DayCell
                    key={day.dateKey}
                    day={day}
                    resource={resource}
                    entries={entriesByCell.get(cellKey(resource.id, day.dateKey)) ?? []}
                    isLoadingEntries={isLoadingEntries}
                    onEntryClick={onEntryClick}
                    onEmptyCellClick={onEmptyCellClick}
                />
            ))}
        </div>
    );
}
