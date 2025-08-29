import {useAtom} from "jotai";
import {SheetsAtom} from "./SheetsAtom.tsx";
import type {Row} from "./SheetComponent.tsx";

export function useRows(sheet: string) {
    const [sheets, setSheets] = useAtom(SheetsAtom);
    
    const rows = sheets.find(s => s.name == sheet)?.rows!;
    
    const setRows = (rows: Row[]) => {
        const duplicate = [...sheets]
        const currentSheet = duplicate.find(s => s.name == sheet)!;
        currentSheet.rows = rows;
        setSheets(duplicate)
    }
    return [rows, setRows] as const;
}