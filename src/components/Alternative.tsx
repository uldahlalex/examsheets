import {useAtom} from "jotai";
import {RowsAtom} from "./RowsAtom.tsx";
import {format} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import ValidationErrors from "./ValidationErrors.tsx";
import {AllAttendees, AllAttendeesAtom} from "./AllAttendees.tsx";

export interface Row {
    uid: string;
    examName: string;
    attendees: string[],
    startDate: string;
    endDate: string;
}

export default function Alternative() {

    const [attendees] = useAtom(AllAttendeesAtom)
    const [rows, setRows] = useAtom(RowsAtom)

    return (<>
        {
            AllAttendees()
        }
        <div className="mt-15">
            <div className=" bg-base-300 flex">
                <button className="btn btn-primary" onClick={() => setRows([...rows, {
                    uid: crypto.randomUUID(),
                    startDate: format(new Date(), formatStr),
                    examName: '',
                    endDate: format(new Date(), formatStr),
                    attendees: []
                }])}>Add row
                </button>
            </div>

            <div className="overflow-x-auto">

                <table className="table">
                    <thead>
                    <tr>
                        <th>Exam Name</th>
                        <th>Attendees</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Validation problems</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        rows.map(row => {
                            return (<tr key={row.uid}>
                                <td>
                                    <button className="btn btn-xs btn-error mr-2" onClick={() => {
                                        setRows(rows.filter(r => r.uid !== row.uid))
                                    }}>Delete
                                    </button>
                                </td>
                                <td>{
                                    <input value={row.examName} onChange={e => {
                                        const duplicate = [...rows];
                                        const existing = duplicate.find(r => r.uid == row.uid)!;
                                        existing.examName = e.target.value;
                                        setRows(duplicate)
                                    }}/>
                                }</td>
                                <td>
                                    <input value={row.attendees} onChange={e => {
                                        const duplicate = [...rows];
                                        const existing = duplicate.find(r => r.uid == row.uid)!;
                                        existing.attendees = e.target.value.split(',').map(s => s.trim());
                                        setRows(duplicate)
                                    }}/>
                                </td>
                                <td>
                                    <input value={row.startDate} onChange={e => {
                                        const duplicate = [...rows];
                                        const existing = duplicate.find(r => r.uid == row.uid)!;
                                        existing.startDate = e.target.value;
                                        setRows(duplicate)
                                    }}/>{
                                }</td>
                                <td>

                                    <input value={row.endDate} onChange={e => {
                                        const duplicate = [...rows];
                                        const existing = duplicate.find(r => r.uid == row.uid)!;
                                        existing.endDate = e.target.value;
                                        setRows(duplicate)
                                    }}/></td>
                                {ValidationErrors(row, rows, attendees)}
                            </tr>)
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>

    </>)


}