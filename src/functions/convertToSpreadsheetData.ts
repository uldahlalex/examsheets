import {headers} from "../constants/Headers.tsx";
import type {Row} from "../types/row.ts";
import type {CellBase, Matrix} from "react-spreadsheet";


export const convertToSpreadsheetData = (examList: Row[]): Matrix<CellBase> => {


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

const parseDate = (value: any): Date | undefined => {
    if (!value || value === '') {
        return undefined;
    }
    
    // If it's already a Date object, return it
    if (value instanceof Date) {
        return value;
    }
    
    // Try to parse as a date string
    const parsed = new Date(value);
    
    // Check if the parsed date is valid
    if (!isNaN(parsed.getTime())) {
        return parsed;
    }
    return undefined;
    
};

// Column mapping based on header order
const COLUMN_INDICES = {
    EXAM_NAME: 0,
    ATTENDEES: 1,
    START_TIME: 2,
    END_TIME: 3
} as const;

export const convertFromSpreadsheetData = (data: Matrix<CellBase>): Row[] => {
    // Skip the header row (first row) and filter out empty rows
    const ret = data.slice(1)
        .filter(row => row[COLUMN_INDICES.EXAM_NAME]?.value?.toString().trim())
        .map(row => {
            console.log('Converting row:', row);
            const newRow: Row = {
                examName: row[COLUMN_INDICES.EXAM_NAME]?.value?.toString() || '',
                attendees: typeof row[COLUMN_INDICES.ATTENDEES]?.value === 'string'
                    ? row[COLUMN_INDICES.ATTENDEES]?.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : [],
                startTime: parseDate(row[COLUMN_INDICES.START_TIME]?.value) || "No date",
                endTime: parseDate(row[COLUMN_INDICES.END_TIME]?.value) || "No date",
            }
            return newRow;
        });
    return ret;
};
