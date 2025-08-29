import {useAtom} from "jotai";
import {SheetsAtom} from "./SheetsAtom.tsx";
import type {Row} from "./SheetComponent.tsx";

export function useSheet(sheet: string) {
    const [sheets, setSheets] = useAtom(SheetsAtom);
    
    const rows = sheets.find(s => s.name == sheet)?.rows || [];
    const attendees = sheets.find(s => s.name == sheet)?.assessors || [];
    const setAttendees = (attendees: string[]) => {
        const duplicate = [...sheets]
        const currentSheet = duplicate.find(s => s.name == sheet)!;
        console.log(currentSheet)
        currentSheet.assessors = attendees;
        setSheets(duplicate)
    }
    
    const setRows = (rows: Row[]) => {
        const duplicate = [...sheets]
        const currentSheet = duplicate.find(s => s.name == sheet)!;
        currentSheet.rows = rows;
        setSheets(duplicate)
    }
    return [rows, setRows, attendees, setAttendees] as const;
}