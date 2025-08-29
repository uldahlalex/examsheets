import type {AttendeeProps} from "./AttendeeProps.tsx";
import {useSheet} from "./useSheet.ts";

function Attendee(prop: AttendeeProps) {


    return <div className="">
     
        <input className="input input-xs w-20" value={prop.attendee} onChange={e =>
            prop.setAttendee(e.target.value)}/>
        <button className="btn btn-xs btn-error" onClick={() => {
            prop.onDelete()
        }}>Delete
        </button>
    </div>;
}

// @ts-ignore
export function AllAttendees(sheet) {
    console.log(sheet)
    const [rows, setRows,attendees, setAttendees] = useSheet(sheet.sheet)
    return <div>

        <div className="">
            {attendees.map(attendee => {
                return <div key={attendee}><Attendee
                    onDelete={() => {
                        setAttendees(attendees.filter(a => a !== attendee))
                    }}
                    attendee={attendee}
                    setAttendee={(newAttendee) => {
                        const duplicate = [...attendees];
                        const index = duplicate.findIndex(a => a == attendee);
                        duplicate[index] = newAttendee;
                        setAttendees(duplicate)
                    }}/></div>
            })}

        </div>
        <input type="text" placeholder="Add attendee" className="input input-bordered input-xs w-34" onKeyDown={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                if (!attendees.includes(e.currentTarget.value.trim())) {
                    setAttendees([...attendees, e.currentTarget.value.trim()]);
                }
                e.currentTarget.value = '';
            }
        }}/>
    </div>;
}