import {useState} from 'react';
import Spreadsheet, {type CellBase, type Matrix} from 'react-spreadsheet';
import type {Row} from "../types/row.ts";
import {useAtom} from "jotai/react/useAtom";
import {ExamsAtom} from "../state/atoms.ts";
import {convertFromSpreadsheetData, convertToSpreadsheetData} from "../functions/convertToSpreadsheetData.ts";
import type {CellData} from "../types/CellData.tsx";

export default function ReactSpreadsheetDemo() {
    const [exams, setExams] = useAtom(ExamsAtom);
    const [data, setData] = useState<CellData>(convertToSpreadsheetData(exams));


    const addNewRow = () => {
        const newExam: Row = {
            examName: 'New Exam',
            attendees: [],
            startTime: new Date(),
            endTime: new Date(),
        };
        
        const updatedExams = [...exams, newExam];
        setExams(updatedExams);
        setData(convertToSpreadsheetData(updatedExams));
    };

    const handleDataChange = (newData: ((prevState: CellData) => CellData) | Matrix<CellBase<any>>) => {
        let actualData: CellData;
        
        if (typeof newData === 'function') {
            actualData = newData(data);
        } else {
            actualData = newData as CellData;
        }
        const nonHeaderRows = actualData.slice(1);
        const lastRowHasData = nonHeaderRows.length > 0 && 
            nonHeaderRows[nonHeaderRows.length - 1].some(cell => cell?.value && cell.value !== '');
        
        if (lastRowHasData) {
            // Add an empty row
            const emptyRow = [
                { value: '' },
                { value: '' },
                { value: '' },
                { value: '' }
            ];
            actualData = [...actualData, emptyRow];
        }
        
        setData(actualData);
        const updatedExams = convertFromSpreadsheetData(actualData);
        setExams(updatedExams);
    };

  return (
      <>

      <div>
          <button onClick={addNewRow}>
              Add New Row
          </button>
      </div>

      <div>
          <Spreadsheet
              data={data}
              onChange={e => handleDataChange(e)}
          />
      </div>
          
      </>
      
  );
}