import { ObjectItem } from "mendix";
import { PlannerEntry } from "../../types";
import { cellKey, indexEntriesByCell } from "../plannerIndex";

describe("plannerIndex", () => {
    it("groups multiple entries in the same resource/day cell", () => {
        const entries: PlannerEntry[] = [
            entry("2", "resource-1", "2026-05-04", "Workshop"),
            entry("1", "resource-1", "2026-05-04", "Kickoff"),
            entry("3", "resource-2", "2026-05-04", "Install")
        ];

        const index = indexEntriesByCell(entries);

        expect(index.get(cellKey("resource-1", "2026-05-04"))?.map(item => item.title)).toEqual([
            "Kickoff",
            "Workshop"
        ]);
        expect(index.get(cellKey("resource-2", "2026-05-04"))).toHaveLength(1);
    });
});

function entry(id: string, resourceId: string, dateKey: string, title: string): PlannerEntry {
    return {
        id,
        resourceId,
        dateKey,
        title,
        date: new Date(`${dateKey}T00:00:00`),
        item: { id } as unknown as ObjectItem
    };
}
