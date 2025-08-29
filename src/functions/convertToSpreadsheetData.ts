import {headers} from "../constants/Headers.tsx";
import type {Row} from "../types/row.ts";

import type {CellData} from "../types/CellData.tsx";

export const convertToSpreadsheetData = (examList: Row[]): CellData => {


    const rows = examList.map(exam => {
        const isInvalidTimeRange = exam.startTime > exam.endTime;

        return [
            {
                value: exam.examName,
                className: isInvalidTimeRange ? 'invalid-time-range' : ''
            },
            {value: exam.attendees.join(', ')}, // Convert array to string
            {value: exam.startTime.toLocaleString()}, // Convert Date to string
            {value: exam.endTime.toLocaleString()}, // Convert Date to string
        ];
    });

    return [headers, ...rows];
};

export const convertFromSpreadsheetData = (data: CellData): Row[] => {
    return data.slice(1).map(row => ({
        examName: row[0]?.value || '',
        attendees: typeof row[1]?.value === 'string'
            ? row[1].value.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],
        startTime: new Date(row[2]?.value || Date.now()),
        endTime: new Date(row[3]?.value || Date.now()),
    })).filter(exam => exam.examName.trim() !== '');
};
