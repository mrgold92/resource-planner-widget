import { ActionValue, ListActionValue, ObjectItem } from "mendix";
import { PlannerEntry, PlannerResource } from "../types";
import { localDateKey, startOfLocalDay } from "./dateUtils";
import { isKnownResource } from "./plannerIndex";

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
    resourceAssociation?: ListReferenceGetter;
    dateAttribute?: ItemValueGetter<Date>;
    titleValues?: ItemValueGetter<string>;
    subtitleValues?: ItemValueGetter<string>;
    colorClassValues?: ItemValueGetter<string>;
}): PlannerEntry[] {
    return args.items.flatMap((item, index) => {
        const resourceId = resourceIdFromAssociation(args.resourceAssociation, item);
        const date = args.dateAttribute?.get(item)?.value;

        if (!resourceId || !date || !isKnownResource(resourceId, args.resources)) {
            return [];
        }

        const localDate = startOfLocalDay(date);

        return [
            {
                id: String(item.id),
                item,
                resourceId,
                date: localDate,
                dateKey: localDateKey(localDate),
                title: textValue(args.titleValues, item, `Entry ${index + 1}`),
                subtitle: textValue(args.subtitleValues, item, ""),
                colorClass: sanitizeClassName(textValue(args.colorClassValues, item, ""))
            }
        ];
    });
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
