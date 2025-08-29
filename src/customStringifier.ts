import type {Row, StringifiedRow} from "./atoms.ts";

export default function customStringifier(rows: Row[]): StringifiedRow[] {
    const output = rows.map(r => {
        const stringified: StringifiedRow = {
            attendees: r.attendees.join(", "),
            endTime: r.endTime.toLocaleString(),
            startTime: r.startTime.toLocaleString(),
            examName: r.examName
        }
        return stringified;
    })
    return output;
}