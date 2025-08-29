import {atomWithStorage} from "jotai/utils";
import type {Row} from "./Alternative.tsx";
import { format } from "date-fns";

export const RowsAtom = atomWithStorage<Row[]>('tablerows', [
    {
        attendees: ['jle', 'aup'],
        endDate: format(new Date(), 'yyyy/MM/dd HH:mm'),
        examName: 'important exam',
        startDate: format(new Date(), 'yyyy/MM/dd HH:mm'),
        uid: crypto.randomUUID()
    }
])