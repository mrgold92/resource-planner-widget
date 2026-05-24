import { ReactElement } from "react";
import { ResourceplannerwidgetContainerProps } from "../typings/ResourceplannerwidgetProps";
import { PlannerGrid } from "./components/PlannerGrid";
import { FirstDayOfWeek, HeightMode } from "./types";
import { monthLabel, getMonthDays, startOfLocalDay } from "./utils/dateUtils";
import { actionFor, normalizeEntries, normalizeResources } from "./utils/mendixValues";
import { indexEntriesByCell } from "./utils/plannerIndex";

import "./ui/Resourceplannerwidget.css";

export function Resourceplannerwidget(props: ResourceplannerwidgetContainerProps): ReactElement {
    const anchorDate = startOfLocalDay(props.visibleMonthAttribute.value ?? new Date());
    const resourceItems = props.resourcesDatasource.items ?? [];
    const entryItems = props.entriesDatasource?.items ?? [];
    const days = getMonthDays(anchorDate, props.firstDayOfWeek as FirstDayOfWeek, props.showWeekends);
    const isLoadingResources = props.resourcesDatasource.status !== "available";
    const isLoadingEntries = props.entriesDatasource?.status === "loading";
    const resources = normalizeResources(resourceItems, props.resourceTitle, props.resourceSubtitle);
    const entries = normalizeEntries({
        items: entryItems,
        resources,
        resourceAssociation: props.entryResourceAssociation,
        dateAttribute: props.entryDateAttribute,
        titleValues: props.entryTitle,
        subtitleValues: props.entrySubtitle,
        colorClassValues: props.entryColorClass
    }).filter(entry => days.some(day => day.dateKey === entry.dateKey));
    const entriesByCell = indexEntriesByCell(entries);

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
