import {atomWithStorage} from "jotai/utils";
import {format} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import type {Row} from "./Row.tsx";


export interface Sheet {
    rows: Row[]
    name: string
    assessors: string[]
    classes: string[]
}

export const SheetsAtom = atomWithStorage<Sheet[]>('sheet', [
    {
        rows: [
            {
                attendees: ['jle', 'aup'],
                endDate: format(new Date(), formatStr),
                examName: 'important exam',
                startDate: format(new Date(), formatStr),
                uid: crypto.randomUUID(),
                wiseflowDeadline: '',
                hold: '',
                klasse: '',
                ects: undefined,
                examType: '',
                groupSubmission: false,
                eksternCensur: false,
                tilsyn: false,
                materialeUpload: '',
                lokale: '',
                forplejning: '',
            }
        ],
        name: "dmuvinter26",
        assessors: [],
        classes: []
    }, {
        name: "dmusommer26",
        rows: [],
        assessors: [],
        classes: []
    }


])