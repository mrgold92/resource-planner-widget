import { ObjectItem } from "mendix";
import { PlannerResource } from "../../types";
import { normalizeEntries } from "../mendixValues";

describe("mendixValues", () => {
    it("normalizes only entries for visible resources and dates", () => {
        const resourceItem = item("resource-1");
        const resources: PlannerResource[] = [{ id: "resource-1", title: "Team", item: resourceItem }];
        const visibleEntry = item("entry-1");
        const outsideMonthEntry = item("entry-2");
        const unknownResourceEntry = item("entry-3");

        const entries = normalizeEntries({
            items: [visibleEntry, outsideMonthEntry, unknownResourceEntry],
            resources,
            visibleDateKeys: new Set(["2026-05-04"]),
            resourceAssociation: {
                get: currentItem => ({
                    value: currentItem === unknownResourceEntry ? item("resource-2") : resourceItem
                })
            },
            dateAttribute: {
                get: currentItem => ({
                    value: currentItem === outsideMonthEntry ? new Date(2026, 5, 1) : new Date(2026, 4, 4)
                })
            },
            titleValues: {
                get: currentItem => ({ value: currentItem.id === "entry-1" ? "Kickoff" : "Hidden" })
            }
        });

        expect(entries.map(entry => entry.id)).toEqual(["entry-1"]);
        expect(entries[0].title).toBe("Kickoff");
        expect(entries[0].dateKey).toBe("2026-05-04");
    });
});

function item(id: string): ObjectItem {
    return { id } as unknown as ObjectItem;
}
