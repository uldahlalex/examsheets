import {format} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import ValidationErrors from "./ValidationErrors.tsx";
import {AllAttendees} from "./AllAttendees.tsx";
import {useState} from "react";
import {useSheet} from "./useSheet.ts";
import {useParams} from "react-router";

export interface Row {
    uid: string;
    examName: string;
    attendees: string[],
    startDate: string;
    endDate: string;
}


export type SheetParams = {
    sheetId: string;
}
export default function SheetComponent() {

    const params = useParams<SheetParams>();
    const [rows, setRows, attendees, setAttendees] = useSheet(params.sheetId!);
    const [order, setOrder] = useState<string>('examName')
    const orderedRows: Row[] = [...rows].sort((a: Row, b: Row): number => {
        if (order === 'examName') {
            return a.examName.localeCompare(b.examName);
        }
        if(order === 'startDate') {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return 0;
        
        });
    

    return (<>
   
  
  
     
        <div className="mt-15">
            <div className=" flex">
                <div className="join">

                    <button className="btn btn-xs btn-primary join-item" onClick={() => setRows([...rows, {
                        uid: crypto.randomUUID(),
                        startDate: format(new Date(), formatStr),
                        examName: '',
                        endDate: format(new Date(), formatStr),
                        attendees: [],
                    }])}>+ Add row
                    </button>
                    <button className="btn join-item btn-xs" popoverTarget="popover-1" style={{
                        // @ts-ignore
                        anchorName: "--anchor-1" } }>
                        Attendees
                    </button>

                    <ul className="dropdown menu w-45 rounded-box bg-base-100 shadow-sm"
                        popover="auto" id="popover-1"
                    
                        style={{ 
                            // @ts-ignore
                            positionAnchor: "--anchor-1" } }>
                        <AllAttendees sheet={params.sheetId!} />
                    </ul>
                    <button className="btn join-item btn-xs" popoverTarget="popover-2" style={{
                        // @ts-ignore
                        anchorName: "--anchor-1" } }>
                        Now allowed dates
                    </button>

                    <ul className="dropdown menu w-45 rounded-box bg-base-100 shadow-sm"
                        popover="auto" id="popover-2" style={{
                        // @ts-ignore
                        positionAnchor: "--anchor-1" } }>
                    {/*    todo*/}
                    </ul>
                    <select className="select select-xs join-item" value={order} onChange={e => setOrder(e.target.value)}>
                    <option value="">Manual ordering</option>
                    <option value="examName">Semester ascending</option>

                    <option value="startDate">Start Date Ascending</option>
                </select>
             
                </div>
       
        
            </div>

            <div className="overflow-x-auto">

                <table className="table table-xs">
                    <thead>
                    <tr>
                        <th>Actions</th>
                        <th>Exam Name</th>
                        <th>Attendees</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Validation problems</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        orderedRows.map(row => {
                            return (<tr key={row.uid}>
                                <td className="flex h-max">
                                    <span></span>
                                    <button className="btn btn-xs btn-error" onClick={() => {
                                        setRows(rows.filter(r => r.uid !== row.uid))
                                    }}>🗑️
                                    </button>
                                    <span className="flex flex-col">     
                                        <button onClick={() => {
                                            setOrder('')
                                            const duplicate = [...rows];
                                            const index = duplicate.findIndex(r => r.uid == row.uid);
                                            if (index > 0) {
                                                const temp = duplicate[index - 1];
                                                duplicate[index - 1] = duplicate[index];
                                                duplicate[index] = temp;
                                                setRows(duplicate)
                                            }
                                        }} className="btn btn-xs">☝️</button>
                                    <button onClick={() => {
                                        setOrder('')
                                        const duplicate = [...rows];
                                        const index = duplicate.findIndex(r => r.uid == row.uid);
                                        if (index < duplicate.length - 1) {
                                            const temp = duplicate[index + 1];
                                            duplicate[index + 1] = duplicate[index];
                                            duplicate[index] = temp;
                                            setRows(duplicate)
                                        }
                                    }} className="btn btn-xs">👇</button></span>

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
                                    <input  value={row.attendees} onChange={e => {
                                        const duplicate = [...rows];
                                        const existing = duplicate.find(r => r.uid == row.uid)!;
                                        existing.attendees = e.target.value.split(',').map(s => s.trim());
                                        setRows(duplicate)
                                    }}/>
                                </td>
                                <td className="w-40">
                                    <input value={row.startDate} onChange={e => {
                                        const duplicate = [...rows];
                                        const existing = duplicate.find(r => r.uid == row.uid)!;
                                        existing.startDate = e.target.value;
                                        setRows(duplicate)
                                    }}/>{
                                }</td>
                                <td>

                                    <input className="w-40" value={row.endDate} onChange={e => {
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
Eksamensplan for hver person:
            {
                rows.filter(r => r.attendees.includes('jle')).map(exam => {
                    return <div key={exam.uid}>{exam.examName} {exam.startDate} - {exam.endDate}</div>
                })
            }
        </div>

    </>)


}