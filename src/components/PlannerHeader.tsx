import { ReactElement } from "react";
import classNames from "classnames";
import { PlannerDay } from "../types";

export interface PlannerHeaderProps {
    monthLabel: string;
    days: PlannerDay[];
}

export function PlannerHeader({ monthLabel, days }: PlannerHeaderProps): ReactElement {
    return (
        <div className="rpw-header-row" role="row">
            <div className="rpw-resource-header" role="columnheader">
                <span className="rpw-month-label">{monthLabel}</span>
            </div>
            {days.map(day => (
                <div
                    key={day.dateKey}
                    className={classNames("rpw-day-header", {
                        "rpw-day-header-weekend": day.isWeekend,
                        "rpw-day-header-today": day.isToday
                    })}
                    role="columnheader"
                    aria-label={day.dateKey}
                >
                    <span className="rpw-weekday">{day.weekdayLabel}</span>
                    <span className="rpw-day-number">{day.dayOfMonth}</span>
                </div>
            ))}
        </div>
    );
}
