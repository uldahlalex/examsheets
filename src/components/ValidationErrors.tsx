import {parse} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import type {Row} from "./Alternative.tsx";
import {useAtom} from "jotai";
import {RowsAtom} from "./RowsAtom.tsx";

export default function ValidationErrors(row: Row, rows: Row[], attendees: string[]) {
    

    function isBeforeAfterEnd() {
        return <>
            {
                parse(row.startDate, formatStr, new Date()) > parse(row.endDate, formatStr, new Date()) &&
                <p>Start date is not before end date!</p>
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
                <p>Attendee conflict with exam(s): {conflicts.map(c => c.examName).join(", ")}</p>
            }
        </>
    }

    function doAttendeesExist() {
        return <>
            {
                row.attendees.some(a => !attendees.includes(a)) &&
                <p>One or more attendees do not exist in the global attendee list!</p>
            }
        </>
    }

    return <td>
        {isBeforeAfterEnd()}
        {isAttendeeConflict()}
        {doAttendeesExist()}
    </td>;
}