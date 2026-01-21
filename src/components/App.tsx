import {type Sheet, SheetsAtom} from "./SheetsAtom.tsx";
import {useAtom} from "jotai";
import {createBrowserRouter, RouterProvider, useNavigate} from "react-router";
import SheetComponent from "./SheetComponent.tsx";
import {useState} from "react";

export default function App() {
    return <div>
        <RouterProvider router={createBrowserRouter([
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/:sheetId',
                element: <SheetComponent/>
            }
        ])}/>
    </div>;
}

export function Home() {
    const [sheets, setSheets] = useAtom(SheetsAtom);
    const navigate = useNavigate();
    const [newSheetName, setNewSheetName] = useState('');

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Eksamens-planlægger</h1>
                    <p className="text-base-content/70">Vælg en eksamens-sæson eller opret en ny</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {sheets.map(sheet => (
                        <div key={sheet.name} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body">
                                <h2 className="card-title text-xl">{sheet.name}</h2>
                                <p className="text-sm text-base-content/60">
                                    {sheet.rows.length} eksamen{sheet.rows.length !== 1 ? 'er' : ''}
                                    {sheet.assessors.length > 0 && ` · ${sheet.assessors.length} bedømmere`}
                                </p>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate('/' + sheet.name)}
                                    >
                                        Åbn
                                    </button>
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex={0} className="btn btn-ghost btn-sm">⋮</label>
                                        <ul tabIndex={0}
                                            className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 z-10">
                                            <li>
                                                <button onClick={() => {
                                                    const d1: Sheet = {...sheet, name: sheet.name + '-kopi'}
                                                    const duplicate = [...sheets, d1];
                                                    setSheets(duplicate)
                                                }}>
                                                    Dupliker
                                                </button>
                                            </li>
                                            <li>
                                                <button onClick={() => {
                                                    if (confirm(`Er du sikker på at du vil slette "${sheet.name}"?`)) {
                                                        setSheets(sheets.filter(s => s.name !== sheet.name))
                                                    }
                                                }} className="text-error">
                                                    Slet
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div
                        className="card bg-base-100 shadow-xl border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                        <div className="card-body items-center justify-center">
                            <div className="text-6xl text-base-300 mb-4">+</div>
                            <h3 className="card-title text-lg">Ny sæson</h3>
                            <input
                                type="text"
                                placeholder="f.eks. dmusommer26"
                                className="input input-bordered input-sm w-full max-w-xs mt-2"
                                value={newSheetName}
                                onChange={(e) => setNewSheetName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newSheetName.trim()) {
                                        setSheets([...sheets, {
                                            name: newSheetName.trim(),
                                            rows: [],
                                            assessors: [],
                                            classes: []
                                        }]);
                                        setNewSheetName('');
                                    }
                                }}
                            />
                            <button
                                className="btn btn-primary btn-sm mt-2"
                                disabled={!newSheetName.trim()}
                                onClick={() => {
                                    if (newSheetName.trim()) {
                                        setSheets([...sheets, {
                                            name: newSheetName.trim(),
                                            rows: [],
                                            assessors: [],
                                            classes: []
                                        }]);
                                        setNewSheetName('');
                                    }
                                }}
                            >
                                Opret
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}