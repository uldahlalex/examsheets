import {parse} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import type {Row} from "./SheetComponent.tsx";
import {useAtom} from "jotai";
import {SheetsAtom} from "./SheetsAtom.tsx";

export default function ValidationErrors(row: Row, rows: Row[], attendees: string[]) {
    const errors: { type: string; message: string }[] = [];

    const startDate = parse(row.startDate, formatStr, new Date());
    const endDate = parse(row.endDate, formatStr, new Date());

    if (startDate > endDate) {
        errors.push({
            type: 'time',
            message: 'Starttid efter sluttid'
        });
    }

    const conflicts = rows.filter(r =>
        r.uid !== row.uid &&
        r.attendees.some(a => row.attendees.includes(a)) &&
        ((startDate >= parse(r.startDate, formatStr, new Date()) &&
            startDate < parse(r.endDate, formatStr, new Date())) ||
            (endDate > parse(r.startDate, formatStr, new Date()) &&
                endDate <= parse(r.endDate, formatStr, new Date())) ||
            (startDate <= parse(r.startDate, formatStr, new Date()) &&
                endDate >= parse(r.endDate, formatStr, new Date())))
    );

    if (conflicts.length > 0) {
        errors.push({
            type: 'conflict',
            message: `Konflikt: ${conflicts.map(c => c.examName || 'Unavngivet').join(', ')}`
        });
    }

    const unknownAttendees = row.attendees.filter(a => a && !attendees.includes(a));
    if (unknownAttendees.length > 0) {
        errors.push({
            type: 'attendee',
            message: `Ukendt: ${unknownAttendees.join(', ')}`
        });
    }

    if (errors.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <div className="tooltip" data-tip="Ingen problemer">
                    <span className="text-success text-lg">✓</span>
                </div>
            </div>
        );
    }

    const errorMessages = errors.map(e => e.message).join('\n');

    return (
        <div className="flex items-center justify-center">
            <div className="tooltip tooltip-left" data-tip={errorMessages}>
                <span className="text-error text-lg cursor-help">⚠</span>
            </div>
        </div>
    );
}