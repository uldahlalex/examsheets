import {atom} from "jotai";
import {useAtom} from "jotai";

export const AllAttendeesAtom = atom<string[]>(['jle', 'aup']);
export function AllAttendees() {
    
    const [attendees, setAttendees] = useAtom(AllAttendeesAtom);
    
    return <div className="mt-15">
        <h2 className="text-2xl font-bold mb-5">All Attendees</h2>
        <p>This is a list of all attendees across all exams.</p>
        <ul className="list-disc list-inside">
            {attendees.map(attendee => {
                return <><li key={attendee}>{attendee}</li><button onChange={() => {
                    setAttendees(attendees.filter(a => a !== attendee))
                }}>Delete</button></>
            })}
            
        </ul>
        <input type="text" placeholder="Add attendee" className="input input-bordered w-full max-w-xs" onKeyDown={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                if (!attendees.includes(e.currentTarget.value.trim())) {
                    setAttendees([...attendees, e.currentTarget.value.trim()]);
                }
                e.currentTarget.value = '';
            }
        }}/>
    </div>;
}