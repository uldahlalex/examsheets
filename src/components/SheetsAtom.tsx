import {atomWithStorage} from "jotai/utils";
import {type Row} from "./SheetComponent.tsx";
import { format } from "date-fns";
import {formatStr} from "./FormatStr.tsx";


export interface Sheet {
    rows: Row[]
    name: string
    assessors: string[]
}

export const SheetsAtom = atomWithStorage<Sheet[]>('sheet', [
    {
        rows: [
            {
                attendees: ['jle', 'aup'],
                endDate: format(new Date(), formatStr),
                examName: 'important exam',
                startDate: format(new Date(), formatStr),
                uid: crypto.randomUUID()
            }
        ],
        name: "dmuvinter26",
        assessors: []
    }, {
    name: "dmusommer26",
        rows: [
            
        ],
        assessors: []
    }
    
  
])