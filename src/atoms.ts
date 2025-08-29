import {atomWithStorage} from 'jotai/utils';


export interface Row {
    examName: string;
    attendees: string[];
    startTime: Date;
    endTime: Date;
}

export interface StringifiedRow {
    examName: string;
    attendees: string;
    startTime: string;
    endTime: string;
}

//each row should be modeled based on the Row interface
export const RowsAtom = atomWithStorage<Row[]>('rows',[

    
])