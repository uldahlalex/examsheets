import {useSheet} from "./useSheet.ts";
import type {AttendeeProps} from "../../models/AttendeeProps.tsx";

function ClassItem(prop: AttendeeProps) {
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

export function AllClasses(props: { sheet: string }) {
    const [, , , , classes, setClasses] = useSheet(props.sheet);

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                {classes.length === 0 ? (
                    <p className="text-sm text-base-content/50 text-center py-4">
                        Ingen klasser tilføjet endnu
                    </p>
                ) : (
                    classes.map(klasse => (
                        <ClassItem
                            key={klasse}
                            onDelete={() => {
                                setClasses(classes.filter(c => c !== klasse));
                            }}
                            attendee={klasse}
                            setAttendee={(newClass) => {
                                const duplicate = [...classes];
                                const index = duplicate.findIndex(c => c === klasse);
                                duplicate[index] = newClass;
                                setClasses(duplicate);
                            }}
                        />
                    ))
                )}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Tilføj klasse (tryk Enter)"
                    className="input input-bordered input-sm w-full"
                    onKeyDown={e => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                            if (!classes.includes(e.currentTarget.value.trim())) {
                                setClasses([...classes, e.currentTarget.value.trim()]);
                            }
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
}
