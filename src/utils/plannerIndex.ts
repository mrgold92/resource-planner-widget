import { EntriesByCell, PlannerEntry, PlannerResource } from "../types";

export function cellKey(resourceId: string, dateKey: string): string {
    return `${resourceId}::${dateKey}`;
}

export function indexEntriesByCell(entries: PlannerEntry[]): EntriesByCell {
    return entries.reduce<EntriesByCell>((index, entry) => {
        const key = cellKey(entry.resourceId, entry.dateKey);
        const existing = index.get(key) ?? [];
        existing.push(entry);
        existing.sort((left, right) => left.title.localeCompare(right.title));
        index.set(key, existing);
        return index;
    }, new Map());
}

export function isKnownResource(resourceId: string, resources: PlannerResource[]): boolean {
    return resources.some(resource => resource.id === resourceId);
}
