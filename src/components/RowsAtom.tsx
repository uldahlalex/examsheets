import {atomWithStorage} from "jotai/utils";
import {type Row} from "./App.tsx";
import { format } from "date-fns";
import {formatStr} from "./FormatStr.tsx";

export const RowsAtom = atomWithStorage<Row[]>('tablerows', [
    {
        attendees: ['jle', 'aup'],
        endDate: format(new Date(), formatStr),
        examName: 'important exam',
        startDate: format(new Date(), formatStr),
        uid: crypto.randomUUID()
    }
])