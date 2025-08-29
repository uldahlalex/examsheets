import {useState} from 'react';
import Spreadsheet, {type CellBase, type Matrix} from 'react-spreadsheet';
import type {Row} from "../types/row.ts";
import {useAtom} from "jotai";
import {ExamsAtom} from "../state/atoms.ts";
import {convertToSpreadsheetData, convertFromSpreadsheetData} from "../functions/convertToSpreadsheetData.ts";

export default function ReactSpreadsheetDemo() {
     const [exams, setExams] = useAtom(ExamsAtom);
     
     const data: Matrix<CellBase> =  convertToSpreadsheetData(exams);

     

    const addNewRow = () => {
        const newExam: Row = {
            examName: 'New Exam',
            attendees: [],
            startTime: new Date(),
            endTime: new Date(),
        };

        const updatedExams = [...exams, newExam];
        setExams(updatedExams);
    };

    const handleDataChange = (newData: Matrix<CellBase>) => {
        const nonHeaderRows = newData.slice(1);
        const lastRowHasData = nonHeaderRows.length > 0 && 
            nonHeaderRows[nonHeaderRows.length - 1].some(cell => cell?.value && cell.value !== '');

        let actualData = newData;
        if (lastRowHasData) {
            // Add an empty row
            const emptyRow = [
                { value: '' },
                { value: '' },
                { value: '' },
                { value: '' }
            ];
            actualData = [...newData, emptyRow];
        }
        
    };

    const handleSave = () => {
            const updatedExams = convertFromSpreadsheetData(data);
            setExams(updatedExams);
        
    };

    return (
      <>

      <div style={{ marginBottom: '10px' }}>
          <button onClick={addNewRow} style={{ marginRight: '10px' }}>
              Add New Row
          </button>
          <button onClick={handleSave} style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Save
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