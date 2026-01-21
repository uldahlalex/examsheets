import {parse} from "date-fns";
import {formatStr} from "./FormatStr.tsx";

import type {Row} from "./Row.tsx";

export default function ValidationErrors(row: Row, rows: Row[], attendees: string[], classes: string[]) {
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

    if (row.hold && !attendees.includes(row.hold)) {
        errors.push({
            type: 'hold',
            message: `Hold "${row.hold}" findes ikke i bedømmere`
        });
    }

    if (row.klasse && !classes.includes(row.klasse)) {
        errors.push({
            type: 'klasse',
            message: `Klasse "${row.klasse}" findes ikke i klasserne`
        });
    }

    const klasseConflicts = rows.filter(r =>
        r.uid !== row.uid &&
        row.klasse &&
        r.klasse === row.klasse &&
        ((startDate >= parse(r.startDate, formatStr, new Date()) &&
            startDate < parse(r.endDate, formatStr, new Date())) ||
        (endDate > parse(r.startDate, formatStr, new Date()) &&
            endDate <= parse(r.endDate, formatStr, new Date())) ||
        (startDate <= parse(r.startDate, formatStr, new Date()) &&
            endDate >= parse(r.endDate, formatStr, new Date())))
    );

    if (klasseConflicts.length > 0) {
        errors.push({
            type: 'klasseConflict',
            message: `Klasse konflikt med: ${klasseConflicts.map(c => c.examName || 'Unavngivet').join(', ')}`
        });
    }

    const lokaleConflicts = rows.filter(r =>
        r.uid !== row.uid &&
        row.lokale &&
        r.lokale === row.lokale &&
        ((startDate >= parse(r.startDate, formatStr, new Date()) &&
            startDate < parse(r.endDate, formatStr, new Date())) ||
        (endDate > parse(r.startDate, formatStr, new Date()) &&
            endDate <= parse(r.endDate, formatStr, new Date())) ||
        (startDate <= parse(r.startDate, formatStr, new Date()) &&
            endDate >= parse(r.endDate, formatStr, new Date())))
    );

    if (lokaleConflicts.length > 0) {
        errors.push({
            type: 'lokaleConflict',
            message: `Lokale konflikt med: ${lokaleConflicts.map(c => c.examName || 'Unavngivet').join(', ')}`
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
            <div className="tooltip tooltip-right" data-tip={errorMessages}>
                <span className="text-error text-lg cursor-help">⚠</span>
            </div>
        </div>
    );
}