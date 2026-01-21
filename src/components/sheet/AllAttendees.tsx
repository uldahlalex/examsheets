import {useSheet} from "./useSheet.ts";
import type {AttendeeProps} from "../../models/AttendeeProps.tsx";

function Attendee(prop: AttendeeProps) {
    return (
        <div className="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
            <input
                className="input input-bordered input-sm flex-1"
                value={prop.attendee}
                onChange={e => prop.setAttendee(e.target.value)}
            />
            <button
                className="btn btn-square btn-sm btn-error btn-outline"
                onClick={() => prop.onDelete()}
            >
                ×
            </button>
        </div>
    );
}

export function AllAttendees(props: { sheet: string }) {
    const [, , attendees, setAttendees] = useSheet(props.sheet);

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                {attendees.length === 0 ? (
                    <p className="text-sm text-base-content/50 text-center py-4">
                        Ingen bedømmere tilføjet endnu
                    </p>
                ) : (
                    attendees.map(attendee => (
                        <Attendee
                            key={attendee}
                            onDelete={() => {
                                setAttendees(attendees.filter(a => a !== attendee));
                            }}
                            attendee={attendee}
                            setAttendee={(newAttendee) => {
                                const duplicate = [...attendees];
                                const index = duplicate.findIndex(a => a === attendee);
                                duplicate[index] = newAttendee;
                                setAttendees(duplicate);
                            }}
                        />
                    ))
                )}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Tilføj bedømmer (tryk Enter)"
                    className="input input-bordered input-sm w-full"
                    onKeyDown={e => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                            if (!attendees.includes(e.currentTarget.value.trim())) {
                                setAttendees([...attendees, e.currentTarget.value.trim()]);
                            }
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
}