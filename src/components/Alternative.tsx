import {useAtom} from "jotai";
import {RowsAtom} from "./RowsAtom.tsx";
import {format} from "date-fns";

export interface Row {
    uid: string;
    examName: string;
    attendees: string[],
    startDate: string;
    endDate: string;
}

export default function Alternative() {

    const [rows, setRows] = useAtom(RowsAtom)

    return (<>
        <div className="mt-15">
            <div className=" bg-base-300 flex">
                <button className="btn btn-primary" onClick={() => setRows([...rows, {
                    uid: crypto.randomUUID(),
                    startDate: format(new Date(), 'yyyy/MM/dd HH:mm'),
                    examName: '',
                    endDate: format(new Date(), 'yyyy/MM/dd HH:mm'),
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
                    </tr>
                    </thead>
                    <tbody>
                    {
                        rows.map(r => {
                            return (<tr key={r.examName}>
                                <td>{r.examName}</td>
                                <td>{r.attendees.join(", ")}</td>
                                <td>{
                                   r.startDate.toString()
                                }</td>
                                <td>{
                               r.startDate.toString()
                                }</td>
                            </tr>)
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>

    </>)
 


}