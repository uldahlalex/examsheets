import type { CellBase } from "react-spreadsheet";
import type { Row } from "./row";

export interface SpreadsheetColumn<T extends keyof Row = keyof Row> {
    key: T;
    header: string;
    index: number;
    toCell: (value: Row[T], row: Row) => CellBase;
    fromCell: (cell: CellBase | undefined) => Row[T];
}

export const SPREADSHEET_COLUMNS: SpreadsheetColumn[] = [
    {
        key: 'examName',
        header: 'Exam Name',
        index: 0,
        toCell: (value: string, row: Row) => ({
            value,
            className: row.startTime > row.endTime ? 'invalid-time-range' : ''
        }),
        fromCell: (cell) => cell?.value?.toString() || ''
    },
    {
        key: 'attendees',
        header: 'Attendees',
        index: 1,
        toCell: (value: string[]) => ({ value: value.join(', ') }),
        fromCell: (cell) => typeof cell?.value === 'string'
            ? cell.value.split(',').map(s => s.trim()).filter(Boolean)
            : []
    },
    {
        key: 'startTime',
        header: 'Start Time',
        index: 2,
        toCell: (value: Date) => ({ value: value.toLocaleString() }),
        fromCell: (cell) => {
            const parsed = new Date(cell?.value || Date.now());
            return !isNaN(parsed.getTime()) ? parsed : new Date();
        }
    },
    {
        key: 'endTime',
        header: 'End Time',
        index: 3,
        toCell: (value: Date) => ({ value: value.toLocaleString() }),
        fromCell: (cell) => {
            const parsed = new Date(cell?.value || Date.now());
            return !isNaN(parsed.getTime()) ? parsed : new Date();
        }
    }
] as const;