/**
 * This file was generated from ResourcePlanner.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue, ListValue, Option, ListActionValue, ListAttributeValue, ListExpressionValue, ListReferenceValue } from "mendix";

export type FirstDayOfWeekEnum = "monday" | "sunday";

export type HeightModeEnum = "auto" | "fill";

export interface ResourcePlannerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    visibleMonthAttribute: EditableValue<Date>;
    showWeekends: boolean;
    firstDayOfWeek: FirstDayOfWeekEnum;
    resourcesDatasource: ListValue;
    resourceTitle: ListExpressionValue<string>;
    resourceSubtitle?: ListExpressionValue<string>;
    entriesDatasource?: ListValue;
    entryResourceAssociation?: ListReferenceValue;
    entryDateAttribute?: ListAttributeValue<Date>;
    entryTitle?: ListExpressionValue<string>;
    entrySubtitle?: ListExpressionValue<string>;
    entryColorClass?: ListExpressionValue<string>;
    onResourceClick?: ListActionValue;
    onEntryClick?: ListActionValue;
    onEmptyCellClick?: ActionValue<{ resourceGuid: Option<string>; date: Option<Date> }>;
    resourceColumnWidth: number;
    dayColumnMinWidth: number;
    heightMode: HeightModeEnum;
    visibleResourceRows: number;
}

export interface ResourcePlannerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    visibleMonthAttribute: string;
    showWeekends: boolean;
    firstDayOfWeek: FirstDayOfWeekEnum;
    resourcesDatasource: {} | { caption: string } | { type: string } | null;
    resourceTitle: string;
    resourceSubtitle: string;
    entriesDatasource: {} | { caption: string } | { type: string } | null;
    entryResourceAssociation: string;
    entryDateAttribute: string;
    entryTitle: string;
    entrySubtitle: string;
    entryColorClass: string;
    onResourceClick: {} | null;
    onEntryClick: {} | null;
    onEmptyCellClick: {} | null;
    resourceColumnWidth: number | null;
    dayColumnMinWidth: number | null;
    heightMode: HeightModeEnum;
    visibleResourceRows: number | null;
}
