import { EntriesByCell, PlannerEntry } from "../types";

export function cellKey(resourceId: string, dateKey: string): string {
    return `${resourceId}::${dateKey}`;
}

export function indexEntriesByCell(entries: PlannerEntry[]): EntriesByCell {
    const index = entries.reduce<EntriesByCell>((groupedEntries, entry) => {
        const key = cellKey(entry.resourceId, entry.dateKey);
        const existing = groupedEntries.get(key) ?? [];
        existing.push(entry);
        groupedEntries.set(key, existing);
        return groupedEntries;
    }, new Map());

    index.forEach(cellEntries => {
        cellEntries.sort((left, right) => left.title.localeCompare(right.title));
    });

    return index;
}
