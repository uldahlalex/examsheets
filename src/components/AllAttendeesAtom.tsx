import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";

export const AllAttendeesAtom = atomWithStorage<string[]>('attendees',['jle', 'aup']);