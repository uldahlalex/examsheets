import {format, parse} from "date-fns";
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
const toDatetimeLocal = (dateStr: string): string => {
    try {
        const parsed = parse(dateStr, formatStr, new Date());
        return format(parsed, "yyyy-MM-dd'T'HH:mm");
    } catch {
        return dateStr;
    }
};

const fromDatetimeLocal = (datetimeLocal: string): string => {
    try {
        const parsed = parse(datetimeLocal, "yyyy-MM-dd'T'HH:mm", new Date());
        return format(parsed, formatStr);
    } catch {
        return datetimeLocal;
    }
};

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
            <div className="container mx-auto p-6 max-w-screen-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{params.sheetId}</h1>
                        <p className="text-sm text-base-content/70">{rows.length} eksamen{rows.length !== 1 ? 'er' : ''}</p>
                    </div>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => window.history.back()}
                    >
                        ← Tilbage
                    </button>
                </div>

                <div className="bg-base-100 rounded-lg shadow-xl p-4 mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
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

                <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-pin-rows table-xs">
                            <thead>
                                <tr className="bg-base-300">
                                    <th className="w-24">Handlinger</th>
                                    <th className="min-w-48">Eksamensnavn</th>
                                    <th className="min-w-48">Bedømmere</th>
                                    <th className="min-w-52">Start</th>
                                    <th className="min-w-52">Slut</th>
                                    <th className="w-16">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
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
                                        </td>
                                    </tr>
                                ) : (
                                    orderedRows.map(row => (
                                        <tr key={row.uid} className="hover:bg-base-200">
                                            <td>
                                                <div className="flex gap-1">
                                                    <button
                                                        className="btn btn-square btn-xs btn-ghost"
                                                        onClick={() => moveRow(row.uid, 'up')}
                                                        disabled={order !== ''}
                                                        title="Flyt op"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        className="btn btn-square btn-xs btn-ghost"
                                                        onClick={() => moveRow(row.uid, 'down')}
                                                        disabled={order !== ''}
                                                        title="Flyt ned"
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
                                                        title="Slet"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input input-bordered input-sm w-full"
                                                    value={row.examName}
                                                    onChange={e => handleRowChange(row.uid, 'examName', e.target.value)}
                                                    placeholder="Indtast eksamensnavn"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input input-bordered input-sm w-full"
                                                    value={row.attendees.join(', ')}
                                                    onChange={e => handleRowChange(row.uid, 'attendees', e.target.value.split(',').map(s => s.trim()))}
                                                    placeholder="Adskil med komma"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="datetime-local"
                                                    className="input input-bordered input-sm w-full"
                                                    value={toDatetimeLocal(row.startDate)}
                                                    onChange={e => handleRowChange(row.uid, 'startDate', fromDatetimeLocal(e.target.value))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="datetime-local"
                                                    className="input input-bordered input-sm w-full"
                                                    value={toDatetimeLocal(row.endDate)}
                                                    onChange={e => handleRowChange(row.uid, 'endDate', fromDatetimeLocal(e.target.value))}
                                                />
                                            </td>
                                            <td>
                                                {ValidationErrors(row, rows, attendees)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}