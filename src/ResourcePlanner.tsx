import { ReactElement, useMemo } from "react";
import { ResourcePlannerContainerProps } from "../typings/ResourcePlannerProps";
import { PlannerGrid } from "./components/PlannerGrid";
import { FirstDayOfWeek, HeightMode } from "./types";
import { monthLabel, getMonthDays, startOfLocalDay } from "./utils/dateUtils";
import { actionFor, normalizeEntries, normalizeResources } from "./utils/mendixValues";
import { indexEntriesByCell } from "./utils/plannerIndex";

import "./ui/ResourcePlanner.css";

export function ResourcePlanner(props: ResourcePlannerContainerProps): ReactElement {
    const visibleMonthValue = props.visibleMonthAttribute.value;
    const resourceItems = props.resourcesDatasource.items;
    const entryItems = props.entriesDatasource?.items;
    const anchorDate = useMemo(() => startOfLocalDay(visibleMonthValue ?? new Date()), [visibleMonthValue]);
    const days = useMemo(
        () => getMonthDays(anchorDate, props.firstDayOfWeek as FirstDayOfWeek, props.showWeekends),
        [anchorDate, props.firstDayOfWeek, props.showWeekends]
    );
    const visibleDateKeys = useMemo(() => new Set(days.map(day => day.dateKey)), [days]);
    const isLoadingResources = props.resourcesDatasource.status !== "available";
    const isLoadingEntries = props.entriesDatasource?.status === "loading";
    const resources = useMemo(
        () => normalizeResources(resourceItems ?? [], props.resourceTitle, props.resourceSubtitle),
        [resourceItems, props.resourceTitle, props.resourceSubtitle]
    );
    const entries = useMemo(
        () =>
            normalizeEntries({
                items: entryItems ?? [],
                resources,
                visibleDateKeys,
                resourceAssociation: props.entryResourceAssociation,
                dateAttribute: props.entryDateAttribute,
                titleValues: props.entryTitle,
                subtitleValues: props.entrySubtitle,
                colorClassValues: props.entryColorClass
            }),
        [
            entryItems,
            resources,
            visibleDateKeys,
            props.entryResourceAssociation,
            props.entryDateAttribute,
            props.entryTitle,
            props.entrySubtitle,
            props.entryColorClass
        ]
    );
    const entriesByCell = useMemo(() => indexEntriesByCell(entries), [entries]);

    if (isLoadingResources) {
        return <div className="rpw-state rpw-state-loading">Loading resources</div>;
    }

    if (resources.length === 0) {
        return <div className="rpw-state rpw-state-empty">No resources to show</div>;
    }

    return (
        <PlannerGrid
            className={props.class}
            style={props.style}
            tabIndex={props.tabIndex}
            monthLabel={monthLabel(anchorDate)}
            days={days}
            resources={resources}
            entriesByCell={entriesByCell}
            isEntriesEmpty={entries.length === 0}
            isLoadingEntries={isLoadingEntries}
            resourceColumnWidth={props.resourceColumnWidth}
            dayColumnMinWidth={props.dayColumnMinWidth}
            visibleResourceRows={props.visibleResourceRows}
            heightMode={props.heightMode as HeightMode}
            onResourceClick={resource => {
                const action = actionFor(props.onResourceClick, resource.item);
                if (action?.canExecute !== false) {
                    action?.execute();
                }
            }}
            onEntryClick={entry => {
                const action = actionFor(props.onEntryClick, entry.item);
                if (action?.canExecute !== false) {
                    action?.execute();
                }
            }}
            onEmptyCellClick={(resource, day) => {
                const action = props.onEmptyCellClick;
                if (action?.canExecute !== false) {
                    action?.execute({ resourceGuid: resource.id, date: day.date });
                }
            }}
        />
    );
}
