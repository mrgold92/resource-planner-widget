import { KeyboardEvent, ReactElement } from "react";
import classNames from "classnames";
import { PlannerEntry } from "../types";

export interface EntryCardProps {
    entry: PlannerEntry;
    onClick(entry: PlannerEntry): void;
}

export function EntryCard({ entry, onClick }: EntryCardProps): ReactElement {
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick(entry);
        }
    };

    return (
        <button
            type="button"
            className={classNames("rpw-entry-card", entry.colorClass)}
            onClick={() => onClick(entry)}
            onKeyDown={handleKeyDown}
            title={entry.title}
        >
            <span className="rpw-entry-title">{entry.title}</span>
            {entry.subtitle ? <span className="rpw-entry-subtitle">{entry.subtitle}</span> : null}
        </button>
    );
}
