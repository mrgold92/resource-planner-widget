import { KeyboardEvent, ReactElement } from "react";
import { PlannerDay, PlannerResource } from "../types";

export interface EmptyCellButtonProps {
    day: PlannerDay;
    resource: PlannerResource;
    onClick(resource: PlannerResource, day: PlannerDay): void;
}

export function EmptyCellButton({ day, resource, onClick }: EmptyCellButtonProps): ReactElement {
    const label = `Add entry for ${resource.title} on ${day.dateKey}`;

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick(resource, day);
        }
    };

    return (
        <button
            type="button"
            className="rpw-empty-cell-button"
            aria-label={label}
            title={label}
            onClick={() => onClick(resource, day)}
            onKeyDown={handleKeyDown}
        />
    );
}
