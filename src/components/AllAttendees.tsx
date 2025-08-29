import {useAtom} from "jotai";
import {useState} from "react";
import type {AttendeeProps} from "./AttendeeProps.tsx";
import {AllAttendeesAtom} from "./AllAttendeesAtom.tsx";

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

export function AllAttendees() {

    const [attendees, setAttendees] = useAtom(AllAttendeesAtom);

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