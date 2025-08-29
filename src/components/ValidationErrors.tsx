import {parse} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import type {Row} from "./App.tsx";
import {useAtom} from "jotai";
import {RowsAtom} from "./RowsAtom.tsx";

export default function ValidationErrors(row: Row, rows: Row[], attendees: string[]) {
    

    function isBeforeAfterEnd() {
        return <>
            {
                parse(row.startDate, formatStr, new Date()) > parse(row.endDate, formatStr, new Date()) &&
                <div className="badge badge-error badge-xs">Start date is not before end date!</div>
            }
        </>;
    }

    function isAttendeeConflict() {
        const attendees = row.attendees;
        //Check if any other row has the same attendee and overlapping time
        const conflicts = rows.filter(r => r.uid !== row.uid && r.attendees.some(a => attendees.includes(a)) &&
            ((parse(row.startDate, formatStr, new Date()) >= parse(r.startDate, formatStr, new Date()) &&
                parse(row.startDate, formatStr, new Date()) < parse(r.endDate, formatStr, new Date())) ||
                (parse(row.endDate, formatStr, new Date()) > parse(r.startDate, formatStr, new Date()) &&
                    parse(row.endDate, formatStr, new Date()) <= parse(r.endDate, formatStr, new Date())) ||
                (parse(row.startDate, formatStr, new Date()) <= parse(r.startDate, formatStr, new Date()) &&
                    parse(row.endDate, formatStr, new Date()) >= parse(r.endDate, formatStr, new Date()))
            ));
        return <>
            {
                conflicts.length > 0 &&
                <div className="badge badge-error badge-xs">Attendee conflict with exam(s): {conflicts.map(c => c.examName).join(", ")}</div>
            }
        </>
    }

    function doAttendeesExist() {
        return <>
            {
                row.attendees.some(a => !attendees.includes(a)) &&
                <div className="badge badge-error badge-xs">Unknown attendee(s)</div>
            }
        </>
    }

    return <td>
        {isBeforeAfterEnd()}
        {isAttendeeConflict()}
        {doAttendeesExist()}
    </td>;
}