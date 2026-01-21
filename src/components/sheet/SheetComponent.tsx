import {format, parse} from "date-fns";
import {formatStr} from "../../models/FormatStr.tsx";
import {AllAttendees} from "./AllAttendees.tsx";
import {AllClasses} from "./AllClasses.tsx";
import {useState} from "react";
import {useSheet} from "./useSheet.ts";
import {useParams} from "react-router";
import type {Row} from "../../models/Row.tsx";
import type {SheetParams} from "../../models/SheetParams.tsx";
import {SheetToolbar} from "./SheetToolbar.tsx";
import {ExamRow} from "./ExamRow.tsx";

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

    const addNewRow = () => {
        setRows([...rows, {
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
        }]);
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
                    <SheetToolbar
                        onAddRow={addNewRow}
                        showImport={showImport}
                        setShowImport={setShowImport}
                        showAttendees={showAttendees}
                        setShowAttendees={setShowAttendees}
                        showClasses={showImportClasses}
                        setShowClasses={setShowImportClasses}
                        attendeesCount={attendees.length}
                        classesCount={classes.length}
                        order={order}
                        setOrder={setOrder}
                    />

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
                                            onClick={addNewRow}
                                        >
                                            Tilføj den første eksamen
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                orderedRows.map(row => (
                                    <ExamRow
                                        key={row.uid}
                                        row={row}
                                        rows={rows}
                                        attendees={attendees}
                                        classes={classes}
                                        onRowChange={handleRowChange}
                                        onMoveUp={() => moveRow(row.uid, 'up')}
                                        onMoveDown={() => moveRow(row.uid, 'down')}
                                        onCopy={() => copyRowAsTable(row)}
                                        onDelete={() => {
                                            if (confirm('Slet denne eksamen?')) {
                                                setRows(rows.filter(r => r.uid !== row.uid));
                                            }
                                        }}
                                    />
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
