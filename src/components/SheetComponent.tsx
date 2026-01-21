import {format} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import ValidationErrors from "./ValidationErrors.tsx";
import {AllAttendees} from "./AllAttendees.tsx";
import {useState} from "react";
import {useSheet} from "./useSheet.ts";
import {useParams} from "react-router";

export interface Row {
    uid: string;
    examName: string;
    attendees: string[],
    startDate: string;
    endDate: string;
}


export type SheetParams = {
    sheetId: string;
}
export default function SheetComponent() {
    const params = useParams<SheetParams>();
    const [rows, setRows, attendees, setAttendees] = useSheet(params.sheetId!);
    const [order, setOrder] = useState<string>('examName');
    const [showAttendees, setShowAttendees] = useState(false);

    const orderedRows: Row[] = [...rows].sort((a: Row, b: Row): number => {
        if (order === 'examName') {
            return a.examName.localeCompare(b.examName);
        }
        if (order === 'startDate') {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return 0;
    });

    const handleRowChange = (uid: string, field: keyof Row, value: string | string[]) => {
        const duplicate = [...rows];
        const existing = duplicate.find(r => r.uid === uid)!;
        (existing[field] as typeof value) = value;
        setRows(duplicate);
    };

    const moveRow = (uid: string, direction: 'up' | 'down') => {
        setOrder('');
        const duplicate = [...rows];
        const index = duplicate.findIndex(r => r.uid === uid);
        if (direction === 'up' && index > 0) {
            [duplicate[index - 1], duplicate[index]] = [duplicate[index], duplicate[index - 1]];
            setRows(duplicate);
        } else if (direction === 'down' && index < duplicate.length - 1) {
            [duplicate[index], duplicate[index + 1]] = [duplicate[index + 1], duplicate[index]];
            setRows(duplicate);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{params.sheetId}</h1>
                        <p className="text-base-content/70">{rows.length} eksamen{rows.length !== 1 ? 'er' : ''}</p>
                    </div>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => window.history.back()}
                    >
                        ← Tilbage
                    </button>
                </div>

                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setRows([...rows, {
                                    uid: crypto.randomUUID(),
                                    startDate: format(new Date(), formatStr),
                                    examName: '',
                                    endDate: format(new Date(), formatStr),
                                    attendees: [],
                                }])}
                            >
                                + Ny eksamen
                            </button>
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setShowAttendees(!showAttendees)}
                            >
                                Bedømmere ({attendees.length})
                            </button>
                            <select
                                className="select select-bordered select-sm"
                                value={order}
                                onChange={e => setOrder(e.target.value)}
                            >
                                <option value="">Manuel sortering</option>
                                <option value="examName">Sortér efter navn</option>
                                <option value="startDate">Sortér efter startdato</option>
                            </select>
                        </div>

                        {showAttendees && (
                            <div className="mt-4 p-4 bg-base-200 rounded-lg">
                                <h3 className="font-semibold mb-3">Administrer bedømmere</h3>
                                <AllAttendees sheet={params.sheetId!} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {orderedRows.map(row => (
                        <div key={row.uid} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="card-body p-4">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                    <div className="lg:col-span-1 flex lg:flex-col gap-1">
                                        <button
                                            className="btn btn-square btn-xs btn-ghost"
                                            onClick={() => moveRow(row.uid, 'up')}
                                            disabled={order !== ''}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            className="btn btn-square btn-xs btn-ghost"
                                            onClick={() => moveRow(row.uid, 'down')}
                                            disabled={order !== ''}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            className="btn btn-square btn-xs btn-error"
                                            onClick={() => {
                                                if (confirm('Slet denne eksamen?')) {
                                                    setRows(rows.filter(r => r.uid !== row.uid));
                                                }
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="lg:col-span-3">
                                        <label className="label label-text text-xs">Eksamensnavn</label>
                                        <input
                                            type="text"
                                            className="input input-bordered input-sm w-full"
                                            value={row.examName}
                                            onChange={e => handleRowChange(row.uid, 'examName', e.target.value)}
                                            placeholder="Indtast eksamensnavn"
                                        />
                                    </div>

                                    <div className="lg:col-span-3">
                                        <label className="label label-text text-xs">Bedømmere</label>
                                        <input
                                            type="text"
                                            className="input input-bordered input-sm w-full"
                                            value={row.attendees.join(', ')}
                                            onChange={e => handleRowChange(row.uid, 'attendees', e.target.value.split(',').map(s => s.trim()))}
                                            placeholder="Adskil med komma"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="label label-text text-xs">Start</label>
                                        <input
                                            type="datetime-local"
                                            className="input input-bordered input-sm w-full"
                                            value={row.startDate}
                                            onChange={e => handleRowChange(row.uid, 'startDate', e.target.value)}
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="label label-text text-xs">Slut</label>
                                        <input
                                            type="datetime-local"
                                            className="input input-bordered input-sm w-full"
                                            value={row.endDate}
                                            onChange={e => handleRowChange(row.uid, 'endDate', e.target.value)}
                                        />
                                    </div>

                                    <div className="lg:col-span-1">
                                        {ValidationErrors(row, rows, attendees)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {rows.length === 0 && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body items-center text-center py-12">
                                <p className="text-base-content/50">Ingen eksamener endnu</p>
                                <button
                                    className="btn btn-primary btn-sm mt-4"
                                    onClick={() => setRows([{
                                        uid: crypto.randomUUID(),
                                        startDate: format(new Date(), formatStr),
                                        examName: '',
                                        endDate: format(new Date(), formatStr),
                                        attendees: [],
                                    }])}
                                >
                                    Tilføj den første eksamen
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}