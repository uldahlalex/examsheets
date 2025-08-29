import type {Row, StringifiedRow} from "./atoms.ts";

export default function customParser(stringifiedRows: StringifiedRow[]): Row[] {
    return stringifiedRows.map(sr => {
        const row: Row = {
            examName: sr.examName,
            attendees: sr.attendees.split(", ").map(a => a.trim()).filter(a => a.length > 0),
            startTime: new Date(sr.startTime),
            endTime: new Date(sr.endTime)
        };
        return row;
    });
}