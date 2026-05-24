import { ReactElement } from "react";
import classNames from "classnames";
import { PlannerGridProps } from "../types";
import { PlannerHeader } from "./PlannerHeader";
import { ResourceRow } from "./ResourceRow";

export function PlannerGrid({
    className,
    style,
    tabIndex,
    monthLabel,
    days,
    resources,
    entriesByCell,
    isEntriesEmpty,
    isLoadingEntries,
    resourceColumnWidth,
    dayColumnMinWidth,
    heightMode,
    onResourceClick,
    onEntryClick,
    onEmptyCellClick
}: PlannerGridProps): ReactElement {
    const gridStyle = {
        ...style,
        "--rpw-resource-column-width": `${Math.max(resourceColumnWidth, 140)}px`,
        "--rpw-day-column-min-width": `${Math.max(dayColumnMinWidth, 72)}px`,
        "--rpw-day-count": days.length
    } as import("react").CSSProperties;

    return (
        <section
            className={classNames("rpw-planner", `rpw-height-${heightMode}`, className)}
            style={gridStyle}
            tabIndex={tabIndex}
            aria-label={`Resource planner for ${monthLabel}`}
        >
            <div
                className="rpw-scroll"
                role="grid"
                aria-rowcount={resources.length + 1}
                aria-colcount={days.length + 1}
            >
                <PlannerHeader monthLabel={monthLabel} days={days} />
                {resources.map(resource => (
                    <ResourceRow
                        key={resource.id}
                        resource={resource}
                        days={days}
                        entriesByCell={entriesByCell}
                        isLoadingEntries={isLoadingEntries}
                        onResourceClick={onResourceClick}
                        onEntryClick={onEntryClick}
                        onEmptyCellClick={onEmptyCellClick}
                    />
                ))}
                {isEntriesEmpty && !isLoadingEntries ? (
                    <div className="rpw-empty-overlay">No entries this month</div>
                ) : null}
                {isLoadingEntries ? <div className="rpw-loading-overlay">Loading entries</div> : null}
            </div>
        </section>
    );
}
