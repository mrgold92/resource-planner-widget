import { CSSProperties } from "react";
import { ObjectItem } from "mendix";

export type FirstDayOfWeek = "monday" | "sunday";
export type HeightMode = "auto" | "fill";
export type DatasourceStatus = "available" | "loading" | "unavailable";

export interface ValueStatus<T> {
    readonly value?: T;
    readonly status?: DatasourceStatus;
}

export interface PlannerResource {
    id: string;
    title: string;
    subtitle?: string;
    item: ObjectItem;
}

export interface PlannerEntry {
    id: string;
    resourceId: string;
    date: Date;
    dateKey: string;
    title: string;
    subtitle?: string;
    colorClass?: string;
    item: ObjectItem;
}

export interface PlannerDay {
    date: Date;
    dateKey: string;
    dayOfMonth: number;
    weekdayLabel: string;
    isToday: boolean;
    isWeekend: boolean;
}

export type EntriesByCell = Map<string, PlannerEntry[]>;

export interface PlannerGridProps {
    className?: string;
    style?: CSSProperties;
    tabIndex?: number;
    monthLabel: string;
    days: PlannerDay[];
    resources: PlannerResource[];
    entriesByCell: EntriesByCell;
    isEntriesEmpty: boolean;
    isLoadingEntries: boolean;
    resourceColumnWidth: number;
    dayColumnMinWidth: number;
    visibleResourceRows: number;
    heightMode: HeightMode;
    onResourceClick(resource: PlannerResource): void;
    onEntryClick(entry: PlannerEntry): void;
    onEmptyCellClick(resource: PlannerResource, day: PlannerDay): void;
}
