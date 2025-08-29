import {useEffect, useRef, useState} from 'react'
import {registerAllModules} from 'handsontable/registry';
import {HotTable} from '@handsontable/react-wrapper';
import {useAtom} from "jotai";
import {RowsAtom} from "./atoms.ts";
// import customStringifier from "./customStringifier.ts";
import {DevTools} from 'jotai-devtools';
import 'jotai-devtools/styles.css'
import ReactSpreadsheetDemo from "./ReactSpreadsheetDemo.tsx";

registerAllModules();


function App() {
    const [activeDemo, setActiveDemo] = useState<'handsontable' | 'react-spreadsheet'>('handsontable');
    const [rows, setRows] = useAtom(RowsAtom);
    const hotTableRef = useRef<any>(null);

    useEffect(() => {
        // if (rows.length == 0)
        //     setRows([{
        //         examName: "Exam 1",
        //         startTime: new Date(),
        //         endTime: new Date(),
        //         attendees: ["aup", "jle"],
        //         what: "asd"
        //     }])
    }, []);


    const handleCellChange = (changes: any, source: any) => {
        if (changes && source !== 'loadData' && source === 'edit') {
            const hot = hotTableRef.current?.hotInstance;
            if (hot) {
                const sourceData = hot.getSourceData();
                const filteredData = sourceData.filter((row: any) => 
                    row && Object.values(row).some((value: any) => value !== null && value !== '' && value !== undefined)
                );
                
                const processedData = filteredData.map((row: any) => ({
                    examName: row.examName || '',
                    attendees: typeof row.attendees === 'string' 
                        ? row.attendees.split(',').map((s: string) => s.trim()).filter(Boolean)
                        : Array.isArray(row.attendees) ? row.attendees : [],
                    startTime: row.startTime instanceof Date ? row.startTime : new Date(row.startTime || Date.now()),
                    endTime: row.endTime instanceof Date ? row.endTime : new Date(row.endTime || Date.now()),
                    what: row.what || ''
                }));

                setRows(processedData);
            }
        }
    };

    const handleRowAdded = (index: number, amount: number, source: any) => {
        // Only handle manual row additions, not automatic ones
        if (source === 'ContextMenu' || source === 'UndoRedo.redo') {
            // Don't automatically update the atom for new empty rows
            // Let the user fill them in first, then handleCellChange will save
            console.log('New row(s) added at index:', index, 'Amount:', amount);
        }
    };

    return (
        <>
            <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1>Spreadsheet Library Comparison</h1>
                    <div style={{ marginBottom: '20px' }}>
                        <button 
                            onClick={() => setActiveDemo('handsontable')}
                            style={{ 
                                marginRight: '10px', 
                                padding: '10px 20px',
                                backgroundColor: activeDemo === 'handsontable' ? '#4CAF50' : '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Handsontable (Your Current)
                        </button>
                        <button 
                            onClick={() => setActiveDemo('react-spreadsheet')}
                            style={{ 
                                padding: '10px 20px',
                                backgroundColor: activeDemo === 'react-spreadsheet' ? '#4CAF50' : '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            React Spreadsheet
                        </button>
                    </div>
                </div>

                {activeDemo === 'handsontable' ? (
                    <div>
                        <h2>Handsontable Demo</h2>
                        <p>Exam tracking with dates, arrays, and complex data</p>
                        <HotTable
                            ref={hotTableRef}
                            themeName="ht-theme-main-dark-auto"
                            // other options
                            minSpareCols={1}
                            minSpareRows={1}
                            data={rows}
                            columns={[
                                { 
                                    data: 'examName', 
                                    type: 'text', 
                                    title: 'Exam Name',
                                    renderer: (instance: any, td: any, row: any, col: any, prop: any, value: any) => {
                                        const rowData = instance.getSourceDataAtRow(row);
                                        const startTime = new Date(rowData?.startTime);
                                        const endTime = new Date(rowData?.endTime);
                                        
                                        // Check if start time is after end time
                                        if (startTime > endTime) {
                                            td.style.backgroundColor = '#ff4444';
                                            td.style.color = 'white';
                                        } else {
                                            td.style.backgroundColor = '';
                                            td.style.color = '';
                                        }
                                        
                                        td.innerHTML = value || '';
                                        return td;
                                    }
                                },
                                { 
                                    data: 'attendees', 
                                    type: 'text', 
                                    title: 'Attendees',
                                    renderer: (instance: any, td: any, row: any, col: any, prop: any, value: any) => {
                                        td.innerHTML = Array.isArray(value) ? value.join(', ') : value || '';
                                        return td;
                                    }
                                },
                                { data: 'startTime', type: 'date', title: 'Start Time', dateFormat: 'MM/DD/YYYY h:mm:ss A' },
                                { data: 'endTime', type: 'date', title: 'End Time', dateFormat: 'MM/DD/YYYY h:mm:ss A' }
                            ]}
                            rowHeaders={true}
                            colHeaders={true}
                            height="auto"
                            autoWrapRow={true}
                            autoWrapCol={true}
                            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
                            afterChange={handleCellChange}
                            afterCreateRow={handleRowAdded}
                        />
                    </div>
                ) : (
                    <ReactSpreadsheetDemo />
                )}
                
                <DevTools /> 
            </div>
        </>
    )
}

export default App
