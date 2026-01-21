import {format, parse} from "date-fns";
import {formatStr} from "./FormatStr.tsx";
import ValidationErrors from "./ValidationErrors.tsx";
import {AllAttendees} from "./AllAttendees.tsx";
import {AllClasses} from "./AllClasses.tsx";
import {useState} from "react";
import {useSheet} from "./useSheet.ts";
import {useParams} from "react-router";
import type {Row} from "./Row.tsx";
import type {SheetParams} from "./SheetParams.tsx";


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
    const [rows, setRows, attendees, setAttendees, classes, setClasses] = useSheet(params.sheetId!);
    const [order, setOrder] = useState<string>('examName');
    const [showAttendees, setShowAttendees] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');
    const [showImportAttendees, setShowImportAttendees] = useState(false);
    const [importAttendeesText, setImportAttendeesText] = useState('');
    const [showImportClasses, setShowImportClasses] = useState(false);
    const [importClassesText, setImportClassesText] = useState('');

    const orderedRows: Row[] = [...rows].sort((a: Row, b: Row): number => {
        if (order === 'examName') {
            return a.examName.localeCompare(b.examName);
        }
        if (order === 'startDate') {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return 0;
    });

    const handleRowChange = (uid: string, field: keyof Row, value: string | string[] | number | boolean | undefined) => {
        const duplicate = [...rows];
        const existing = duplicate.find(r => r.uid === uid)!;
        (existing[field] as typeof value) = value;
        setRows(duplicate);
    };

    const moveRow = (uid: string, direction: 'up' | 'down') => {
        const currentList = order ? orderedRows : rows;
        const index = currentList.findIndex(r => r.uid === uid);

        if (direction === 'up' && index > 0) {
            const newList = [...currentList];
            [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
            setRows(newList);
            setOrder('');
        } else if (direction === 'down' && index < currentList.length - 1) {
            const newList = [...currentList];
            [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
            setRows(newList);
            setOrder('');
        }
    };

    const parseImportedDate = (dateStr: string): string => {
        const formats = [
            "dd/MM/yyyy HH:mm:ss",
            "yyyy-MM-dd HH:mm:ss",
            "yyyy/MM/dd HH:mm:ss",
            "MM/dd/yyyy HH:mm:ss",
            "dd-MM-yyyy HH:mm:ss",
            "yyyy-MM-dd HH:mm",
            "yyyy/MM/dd HH:mm",
            "dd/MM/yyyy HH:mm",
            "dd-MM-yyyy HH:mm",
            "MM/dd/yyyy HH:mm",
            "yyyy-MM-dd'T'HH:mm:ss",
            "yyyy-MM-dd'T'HH:mm",
            "yyyy-MM-dd",
            "yyyy/MM/dd",
            "dd/MM/yyyy",
            "dd-MM-yyyy",
            "MM/dd/yyyy"
        ];

        for (const fmt of formats) {
            try {
                const parsed = parse(dateStr.trim(), fmt, new Date());
                if (!isNaN(parsed.getTime())) {
                    return format(parsed, formatStr);
                }
            } catch {
                continue;
            }
        }
        return format(new Date(), formatStr);
    };

    const handleImport = () => {
        const lines = importText.split('\n').filter(line => line.trim());
        const newRows: Row[] = lines
            .map(line => {
                const columns = line.split('\t');
                if (columns.length < 4) {
                    return null;
                }
                const [
                    examName,
                    participantsStr,
                    startDate,
                    endDate,
                    wiseflowDeadline,
                    hold,
                    klasse,
                    ectsStr,
                    examType,
                    groupSubmissionStr,
                    eksternCensurStr,
                    tilsynStr,
                    materialeUpload,
                    lokale,
                    forplejning
                ] = columns;
                const participants = participantsStr.split(',').map(p => p.trim()).filter(p => p);

                const row: Row = {
                    uid: crypto.randomUUID(),
                    examName: examName.trim(),
                    attendees: participants,
                    startDate: parseImportedDate(startDate),
                    endDate: parseImportedDate(endDate),
                    wiseflowDeadline: wiseflowDeadline?.trim() || '',
                    hold: hold?.trim() || '',
                    klasse: klasse?.trim() || '',
                    ects: ectsStr ? Number(ectsStr.trim()) : undefined,
                    examType: examType?.trim() || '',
                    groupSubmission: groupSubmissionStr?.toLowerCase().trim() === 'true' || groupSubmissionStr?.toLowerCase().trim() === 'ja',
                    eksternCensur: eksternCensurStr?.toLowerCase().trim() === 'true' || eksternCensurStr?.toLowerCase().trim() === 'ja',
                    tilsyn: tilsynStr?.toLowerCase().trim() === 'true' || tilsynStr?.toLowerCase().trim() === 'ja',
                    materialeUpload: materialeUpload?.trim() || '',
                    lokale: lokale?.trim() || '',
                    forplejning: forplejning?.trim() || ''
                };
                return row;
            })
            .filter((row): row is Row => row !== null);

        setRows([...rows, ...newRows]);
        setImportText('');
        setShowImport(false);
    };

    const handleImportAttendees = () => {
        const lines = importAttendeesText.split('\n')
            .map(line => line.trim())
            .filter(line => line && !attendees.includes(line));

        setAttendees([...attendees, ...lines]);
        setImportAttendeesText('');
        setShowImportAttendees(false);
    };

    const handleImportClasses = () => {
        const lines = importClassesText.split('\n')
            .map(line => line.trim())
            .filter(line => line && !classes.includes(line));

        setClasses([...classes, ...lines]);
        setImportClassesText('');
        setShowImportClasses(false);
    };

    const copyRowAsTable = async (row: Row) => {
        const dateInterval = `${row.startDate} - ${row.endDate}`;

        const tableData = [
            ['Hvilket hold skal til eksamen:', row.hold || ''],
            ['Fag/eksamen:', row.examName || ''],
            ['Antal ects point:', row.ects?.toString() || ''],
            ['Dato for eksamen:', dateInterval],
            ['Mdt/skr/projekt/:', row.examType || ''],
            ['Gruppeaflevering:', row.groupSubmission ? 'Ja' : 'Nej'],
            ['Dato og tidspunkt for aflevering af projekt:', row.wiseflowDeadline || ''],
            ['Ekstern censor:', row.eksternCensur ? 'Ja' : 'Nej'],
            ['Eksaminator/bedømmere:', row.attendees.join(', ')],
            ['Tilsyn (ja/nej - antal):', row.tilsyn ? 'Ja' : 'Nej'],
            ['Materiale til upload: opgave, oplæg, eksamensregler etc:', row.materialeUpload || ''],
            ['Lokale for eksamen', row.lokale || ''],
            ['Skal der bestilles forplejning:', row.forplejning || '']
        ];

        const textContent = tableData.map(([label, value]) => `${label}\t${value}`).join('\n');

        try {
            await navigator.clipboard.writeText(textContent);
            alert('Kopieret til udklipsholder!');
        } catch (err) {
            alert('Kunne ikke kopiere til udklipsholder');
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
                                wiseflowDeadline: '',
                                hold: '',
                                klasse: '',
                                ects: undefined,
                                examType: '',
                                groupSubmission: false,
                                eksternCensur: false,
                                tilsyn: false,
                                materialeUpload: '',
                                lokale: '',
                                forplejning: '',
                            }])}
                        >
                            + Ny eksamen
                        </button>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setShowImport(!showImport)}
                        >
                            Importér fra regneark
                        </button>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setShowAttendees(!showAttendees)}
                        >
                            Bedømmere ({attendees.length})
                        </button>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setShowImportClasses(!showImportClasses)}
                        >
                            Klasser ({classes.length})
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

                    {showImport && (
                        <div className="mt-4 p-4 bg-base-200 rounded-lg">
                            <h3 className="font-semibold mb-3">Importér eksamener fra regneark</h3>
                            <p className="text-sm text-base-content/70 mb-3">
                                Kopier kolonner fra regneark og indsæt herunder. Kolonner: Eksamensnavn, Bedømmere,
                                Starttid, Sluttid, Wiseflow afleveringsdato, Hold, Klasse, ECTS, Mdt/skr/projekt, Group submission, Ekstern
                                censur, Tilsyn, Materiale til upload, Lokale til eksamen, Bestilles forplejning (alle
                                efter de første 4 er valgfrie)
                            </p>
                            <textarea
                                className="textarea textarea-bordered w-full h-32 font-mono text-xs"
                                placeholder="Indsæt data fra regneark her..."
                                value={importText}
                                onChange={e => setImportText(e.target.value)}
                            />
                            <div className="flex gap-2 mt-3">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleImport}
                                    disabled={!importText.trim()}
                                >
                                    Importér
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                        setImportText('');
                                        setShowImport(false);
                                    }}
                                >
                                    Annuller
                                </button>
                            </div>
                        </div>
                    )}

                    {showAttendees && (
                        <div className="mt-4 p-4 bg-base-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">Administrer bedømmere</h3>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => setShowImportAttendees(!showImportAttendees)}
                                >
                                    Importér bedømmere
                                </button>
                            </div>
                            {showImportAttendees && (
                                <div className="mb-4 p-3 bg-base-300 rounded-lg">
                                    <p className="text-sm text-base-content/70 mb-2">
                                        Kopier bedømmere fra regneark (én per linje) og indsæt herunder:
                                    </p>
                                    <textarea
                                        className="textarea textarea-bordered w-full h-32 font-mono text-xs"
                                        placeholder="aup&#10;rpe&#10;fha&#10;..."
                                        value={importAttendeesText}
                                        onChange={e => setImportAttendeesText(e.target.value)}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleImportAttendees}
                                            disabled={!importAttendeesText.trim()}
                                        >
                                            Importér
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => {
                                                setImportAttendeesText('');
                                                setShowImportAttendees(false);
                                            }}
                                        >
                                            Annuller
                                        </button>
                                    </div>
                                </div>
                            )}
                            <AllAttendees sheet={params.sheetId!}/>
                        </div>
                    )}

                    {showImportClasses && (
                        <div className="mt-4 p-4 bg-base-200 rounded-lg">
                            <h3 className="font-semibold mb-3">Administrer klasser</h3>
                            <AllClasses sheet={params.sheetId!}/>
                        </div>
                    )}
                </div>

                <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-pin-rows table-xs" style={{tableLayout: 'auto'}}>
                            <thead>
                            <tr className="bg-base-300">
                                <th style={{width: '60px'}}>Status</th>
                                <th style={{width: '140px'}}>Handlinger</th>
                                <th>Eksamensnavn</th>
                                <th>Bedømmere</th>
                                <th style={{width: '180px'}}>Start</th>
                                <th style={{width: '180px'}}>Slut</th>
                                <th>Wiseflow afleveringsdato</th>
                                <th>Hold</th>
                                <th>Klasse</th>
                                <th style={{width: '80px'}}>ECTS</th>
                                <th>Mdt/skr/projekt</th>
                                <th style={{width: '100px'}}>Group submission</th>
                                <th style={{width: '100px'}}>Ekstern censur</th>
                                <th style={{width: '80px'}}>Tilsyn</th>
                                <th>Materiale til upload</th>
                                <th>Lokale til eksamen</th>
                                <th>Bestilles forplejning</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={17} className="text-center py-12">
                                        <p className="text-base-content/50">Ingen eksamener endnu</p>
                                        <button
                                            className="btn btn-primary btn-sm mt-4"
                                            onClick={() => setRows([{
                                                uid: crypto.randomUUID(),
                                                startDate: format(new Date(), formatStr),
                                                examName: '',
                                                endDate: format(new Date(), formatStr),
                                                attendees: [],
                                                wiseflowDeadline: '',
                                                hold: '',
                                                klasse: '',
                                                ects: undefined,
                                                examType: '',
                                                groupSubmission: false,
                                                eksternCensur: false,
                                                tilsyn: false,
                                                materialeUpload: '',
                                                lokale: '',
                                                forplejning: '',
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
                                            {ValidationErrors(row, rows, attendees, classes)}
                                        </td>
                                        <td>
                                            <div className="flex gap-1 flex-wrap">
                                                <button
                                                    className="btn btn-square btn-xs btn-ghost"
                                                    onClick={() => moveRow(row.uid, 'up')}
                                                    title="Flyt op"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    className="btn btn-square btn-xs btn-info"
                                                    onClick={() => copyRowAsTable(row)}
                                                    title="Kopiér til kontor"
                                                >
                                                    📋
                                                </button>
                                                <button
                                                    className="btn btn-square btn-xs btn-ghost"
                                                    onClick={() => moveRow(row.uid, 'down')}
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
                                                style={{minWidth: `${Math.max(150, row.examName.length * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.attendees.join(', ')}
                                                onChange={e => handleRowChange(row.uid, 'attendees', e.target.value.split(',').map(s => s.trim()))}
                                                placeholder="Adskil med komma"
                                                style={{minWidth: `${Math.max(150, row.attendees.join(', ').length * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="datetime-local"
                                                className="input input-bordered input-sm"
                                                value={toDatetimeLocal(row.startDate)}
                                                onChange={e => handleRowChange(row.uid, 'startDate', fromDatetimeLocal(e.target.value))}
                                                style={{width: '170px'}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="datetime-local"
                                                className="input input-bordered input-sm"
                                                value={toDatetimeLocal(row.endDate)}
                                                onChange={e => handleRowChange(row.uid, 'endDate', fromDatetimeLocal(e.target.value))}
                                                style={{width: '170px'}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.wiseflowDeadline || ''}
                                                onChange={e => handleRowChange(row.uid, 'wiseflowDeadline', e.target.value)}
                                                placeholder="f.eks. starten af januar"
                                                style={{minWidth: `${Math.max(180, (row.wiseflowDeadline?.length || 0) * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.hold || ''}
                                                onChange={e => handleRowChange(row.uid, 'hold', e.target.value)}
                                                placeholder="Hold"
                                                style={{minWidth: `${Math.max(120, (row.hold?.length || 0) * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.klasse || ''}
                                                onChange={e => handleRowChange(row.uid, 'klasse', e.target.value)}
                                                placeholder="Klasse"
                                                style={{minWidth: `${Math.max(120, (row.klasse?.length || 0) * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="input input-bordered input-sm"
                                                value={row.ects || ''}
                                                onChange={e => handleRowChange(row.uid, 'ects', e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="ECTS"
                                                style={{width: '70px'}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.examType || ''}
                                                onChange={e => handleRowChange(row.uid, 'examType', e.target.value)}
                                                placeholder="Mdt/skr/projekt"
                                                style={{minWidth: `${Math.max(120, (row.examType?.length || 0) * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={row.groupSubmission || false}
                                                onChange={e => handleRowChange(row.uid, 'groupSubmission', e.target.checked)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={row.eksternCensur || false}
                                                onChange={e => handleRowChange(row.uid, 'eksternCensur', e.target.checked)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={row.tilsyn || false}
                                                onChange={e => handleRowChange(row.uid, 'tilsyn', e.target.checked)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.materialeUpload || ''}
                                                onChange={e => handleRowChange(row.uid, 'materialeUpload', e.target.value)}
                                                placeholder="Materiale"
                                                style={{minWidth: `${Math.max(120, (row.materialeUpload?.length || 0) * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.lokale || ''}
                                                onChange={e => handleRowChange(row.uid, 'lokale', e.target.value)}
                                                placeholder="Lokale"
                                                style={{minWidth: `${Math.max(120, (row.lokale?.length || 0) * 8)}px`}}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm w-full"
                                                value={row.forplejning || ''}
                                                onChange={e => handleRowChange(row.uid, 'forplejning', e.target.value)}
                                                placeholder="Forplejning"
                                                style={{minWidth: `${Math.max(120, (row.forplejning?.length || 0) * 8)}px`}}
                                            />
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