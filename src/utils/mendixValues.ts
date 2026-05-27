import { ActionValue, ListActionValue, ObjectItem } from "mendix";
import { PlannerEntry, PlannerResource } from "../types";
import { localDateKey, startOfLocalDay } from "./dateUtils";

type ItemValueGetter<T> = { get(item: ObjectItem): { value?: T } };
type ListReferenceGetter = { get(item: ObjectItem): { value?: ObjectItem } };

export function textValue(values: ItemValueGetter<string> | undefined, item: ObjectItem, fallback: string): string {
    const value = values?.get(item)?.value;
    return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function actionFor(values: ListActionValue | undefined, item: ObjectItem): ActionValue | undefined {
    return values?.get(item);
}

export function normalizeResources(
    items: ObjectItem[],
    titleValues: ItemValueGetter<string>,
    subtitleValues: ItemValueGetter<string> | undefined
): PlannerResource[] {
    return items.map((item, index) => ({
        id: String(item.id),
        item,
        title: textValue(titleValues, item, `Resource ${index + 1}`),
        subtitle: textValue(subtitleValues, item, "")
    }));
}

export function normalizeEntries(args: {
    items: ObjectItem[];
    resources: PlannerResource[];
    visibleDateKeys: Set<string>;
    resourceAssociation?: ListReferenceGetter;
    dateAttribute?: ItemValueGetter<Date>;
    titleValues?: ItemValueGetter<string>;
    subtitleValues?: ItemValueGetter<string>;
    colorClassValues?: ItemValueGetter<string>;
}): PlannerEntry[] {
    const knownResourceIds = new Set(args.resources.map(resource => resource.id));
    const entries: PlannerEntry[] = [];

    args.items.forEach((item, index) => {
        const resourceId = resourceIdFromAssociation(args.resourceAssociation, item);
        const date = args.dateAttribute?.get(item)?.value;

        if (!resourceId || !date || !knownResourceIds.has(resourceId)) {
            return;
        }

        const localDate = startOfLocalDay(date);
        const dateKey = localDateKey(localDate);

        if (!args.visibleDateKeys.has(dateKey)) {
            return;
        }

        entries.push({
            id: String(item.id),
            item,
            resourceId,
            date: localDate,
            dateKey,
            title: textValue(args.titleValues, item, `Entry ${index + 1}`),
            subtitle: textValue(args.subtitleValues, item, ""),
            colorClass: sanitizeClassName(textValue(args.colorClassValues, item, ""))
        });
    });

    return entries;
}

function resourceIdFromAssociation(values: ListReferenceGetter | undefined, item: ObjectItem): string | undefined {
    const value = values?.get(item)?.value;
    return value ? String(value.id) : undefined;
}

function sanitizeClassName(value: string): string | undefined {
    const className = value
        .split(/\s+/)
        .map(part => part.replace(/[^a-zA-Z0-9_-]/g, ""))
        .filter(Boolean)
        .join(" ");

    return className.length > 0 ? className : undefined;
}
