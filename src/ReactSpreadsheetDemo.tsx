import {useState} from 'react';
import Spreadsheet, {type CellBase, type Matrix} from 'react-spreadsheet';

export interface ExamRow {
    examName: string;
    attendees: string[];
    startTime: Date;
    endTime: Date;
}

// Sample data for demo - matching Handsontable structure
const sampleExams: ExamRow[] = [
    {
        examName: 'Mathematics Final',
        attendees: ['alice', 'bob', 'carol'],
        startTime: new Date('2024-01-15T09:00:00'),
        endTime: new Date('2024-01-15T12:00:00'),
    },
    {
        examName: 'Physics Midterm',
        attendees: ['bob', 'dave'],
        startTime: new Date('2024-01-20T14:00:00'),
        endTime: new Date('2024-01-20T16:00:00'),
    },
    {
        examName: 'Invalid Exam (End Before Start)',
        attendees: ['test'],
        startTime: new Date('2024-01-25T16:00:00'),
        endTime: new Date('2024-01-25T14:00:00'), // End is before start
    },
];

type Data = CellBase<any>[][];

export default function ReactSpreadsheetDemo() {
    const [exams, setExams] = useState<ExamRow[]>(sampleExams);

    // Convert exam data to spreadsheet format
    const convertToSpreadsheetData = (examList: ExamRow[]): Data => {
        const header = [
            {value: 'Exam Name', readOnly: true},
            {value: 'Attendees', readOnly: true},
            {value: 'Start Time', readOnly: true},
            {value: 'End Time', readOnly: true},
        ];

        const rows = examList.map(exam => {
            // Check if start time is after end time for conditional formatting
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

        return [header, ...rows];
    };

    // Convert spreadsheet data back to exam objects
    const convertFromSpreadsheetData = (data: Data): ExamRow[] => {
        return data.slice(1).map(row => ({
            examName: row[0]?.value || '',
            attendees: typeof row[1]?.value === 'string' 
                ? row[1].value.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [],
            startTime: new Date(row[2]?.value || Date.now()),
            endTime: new Date(row[3]?.value || Date.now()),
        })).filter(exam => exam.examName.trim() !== '');
    };

    const [data, setData] = useState<Data>(convertToSpreadsheetData(exams));

    const addNewRow = () => {
        const newExam: ExamRow = {
            examName: 'New Exam',
            attendees: [],
            startTime: new Date(),
            endTime: new Date(),
        };
        
        const updatedExams = [...exams, newExam];
        setExams(updatedExams);
        setData(convertToSpreadsheetData(updatedExams));
    };

    const handleDataChange = (newData: ((prevState: Data) => Data) | Matrix<CellBase<any>>) => {
        let actualData: Data;
        
        if (typeof newData === 'function') {
            actualData = newData(data);
        } else {
            actualData = newData as Data;
        }
        
        // Add empty rows automatically if user is editing near the end
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
    <div style={{ padding: '20px' }}>
      <style>
        {`
          .Spreadsheet__cell.invalid-time-range {
            background-color: #ff4444 !important;
            color: white !important;
          }
        `}
      </style>
      <h2>React Spreadsheet Demo</h2>
      <p>Exam tracking with dates, arrays, and complex data (same as Handsontable)</p>
      <p style={{ fontSize: '14px', color: '#666' }}>
        📝 Conditional formatting: Exam names turn red when start time is after end time
      </p>
      
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={addNewRow}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add New Row
        </button>
        <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
          Or edit the last row to auto-add a new empty row
        </span>
      </div>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc' }}>
        <Spreadsheet 
          data={data}
          onChange={e => handleDataChange(e)}
        />
      </div>

      <div>
        <h3>Current Exam Data:</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {JSON.stringify(exams, null, 2)}
        </pre>
      </div>
    </div>
  );
}