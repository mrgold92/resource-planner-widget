import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { PlannerDay, PlannerGridProps } from "../types";
import { PlannerHeader } from "./PlannerHeader";
import { ResourceRow } from "./ResourceRow";

const HEADER_HEIGHT = 56;
const RESOURCE_ROW_HEIGHT = 78;
const VIRTUAL_OVERSCAN_ROWS = 4;

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
    visibleResourceRows,
    heightMode,
    onResourceClick,
    onEntryClick,
    onEmptyCellClick
}: PlannerGridProps): ReactElement {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const normalizedVisibleRows = Math.max(1, Math.floor(visibleResourceRows || 12));
    const shouldVirtualizeRows = resources.length > normalizedVisibleRows;
    const firstVisibleResourceIndex = shouldVirtualizeRows
        ? Math.max(0, Math.floor(scrollTop / RESOURCE_ROW_HEIGHT) - VIRTUAL_OVERSCAN_ROWS)
        : 0;
    const visibleResourceCount = shouldVirtualizeRows
        ? normalizedVisibleRows + VIRTUAL_OVERSCAN_ROWS * 2
        : resources.length;
    const virtualResources = useMemo(
        () => resources.slice(firstVisibleResourceIndex, firstVisibleResourceIndex + visibleResourceCount),
        [firstVisibleResourceIndex, resources, visibleResourceCount]
    );
    const topSpacerRows = shouldVirtualizeRows ? firstVisibleResourceIndex : 0;
    const bottomSpacerRows = shouldVirtualizeRows
        ? Math.max(resources.length - firstVisibleResourceIndex - virtualResources.length, 0)
        : 0;

    // CSS custom properties live on the scroll viewport so they are available
    // to the inner grid and its children via inheritance, without leaking to
    // Mendix ancestor elements.
    const scrollStyle = {
        "--rpw-resource-column-width": `${Math.max(resourceColumnWidth, 140)}px`,
        "--rpw-day-column-min-width": `${Math.max(dayColumnMinWidth, 72)}px`,
        "--rpw-day-count": days.length,
        "--rpw-grid-max-height": `${HEADER_HEIGHT + normalizedVisibleRows * RESOURCE_ROW_HEIGHT}px`
    } as import("react").CSSProperties;

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (heightMode !== "fill" || !scrollEl) return;

        // In fill mode: measure the distance from the scroll container's top edge
        // to the bottom of the viewport and use that as max-height. This makes the
        // widget fill exactly the remaining page space without overflowing it.
        const updateHeight = (): void => {
            const rect = scrollEl.getBoundingClientRect();
            const available = window.innerHeight - rect.top;
            scrollEl.style.maxHeight = `${Math.max(available, 200)}px`;
        };

        updateHeight();

        const ro = new ResizeObserver(updateHeight);
        ro.observe(document.documentElement);
        return () => ro.disconnect();
    }, [heightMode]);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        const today = days.find(day => day.isToday);

        if (!scrollElement || !today) {
            return;
        }

        const todayHeader = scrollElement.querySelector<HTMLElement>(`[data-date-key="${today.dateKey}"]`);

        if (!todayHeader) {
            return;
        }

        const stickyColumnWidth = Math.max(resourceColumnWidth, 140);
        const availableWidth = Math.max(scrollElement.clientWidth - stickyColumnWidth, 0);
        const targetLeft =
            todayHeader.offsetLeft - stickyColumnWidth - availableWidth / 2 + todayHeader.offsetWidth / 2;

        const nextScrollLeft = Math.max(targetLeft, 0);

        if (typeof scrollElement.scrollTo === "function") {
            scrollElement.scrollTo({ left: nextScrollLeft, behavior: "auto" });
        } else {
            scrollElement.scrollLeft = nextScrollLeft;
        }
    }, [days, resourceColumnWidth]);

    const handleScroll = (): void => {
        setScrollTop(scrollRef.current?.scrollTop ?? 0);
    };

    return (
        <section
            className={classNames("rpw-planner", `rpw-height-${heightMode}`, className)}
            style={style}
            tabIndex={tabIndex}
            aria-label={`Resource planner for ${monthLabel}`}
        >
            {/* rpw-scroll: overflow viewport; width 100%, clips everything inside */}
            <div ref={scrollRef} className="rpw-scroll" style={scrollStyle} onScroll={handleScroll}>
                {/* rpw-grid: actual CSS grid; width: max-content so it never constrains the viewport */}
                <div
                    className="rpw-grid"
                    role="grid"
                    aria-rowcount={resources.length + 1}
                    aria-colcount={days.length + 1}
                >
                    <PlannerHeader monthLabel={monthLabel} days={days} />
                    {renderSpacerRows("top-spacer", topSpacerRows, days)}
                    {virtualResources.map(resource => (
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
                    {renderSpacerRows("bottom-spacer", bottomSpacerRows, days)}
                    {isEntriesEmpty && !isLoadingEntries ? (
                        <div className="rpw-empty-overlay">No entries this month</div>
                    ) : null}
                    {isLoadingEntries ? <div className="rpw-loading-overlay">Loading entries</div> : null}
                </div>
            </div>
        </section>
    );
}

function renderSpacerRows(keyPrefix: string, rowCount: number, days: PlannerDay[]): ReactElement | null {
    if (rowCount <= 0) {
        return null;
    }

    const height = rowCount * RESOURCE_ROW_HEIGHT;

    return (
        <div className="rpw-virtual-spacer-row" role="presentation" key={keyPrefix}>
            <div className="rpw-resource-spacer-cell" style={{ height }} />
            {days.map(day => (
                <div key={`${keyPrefix}-${day.dateKey}`} className="rpw-day-spacer-cell" style={{ height }} />
            ))}
        </div>
    );
}
