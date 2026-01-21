import type {Row} from "../../models/Row.tsx";
import {format, parse} from "date-fns";
import {formatStr} from "../../models/FormatStr.tsx";
import ValidationErrors from "./ValidationErrors.tsx";

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

interface ExamRowProps {
    row: Row;
    rows: Row[];
    attendees: string[];
    classes: string[];
    onRowChange: (uid: string, field: keyof Row, value: string | string[] | number | boolean | undefined) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onCopy: () => void;
    onDelete: () => void;
}

export function ExamRow({
    row,
    rows,
    attendees,
    classes,
    onRowChange,
    onMoveUp,
    onMoveDown,
    onCopy,
    onDelete
}: ExamRowProps) {
    return (
        <tr className="hover:bg-base-200">
            <td>
                {ValidationErrors(row, rows, attendees, classes)}
            </td>
            <td>
                <div className="flex gap-1 flex-wrap">
                    <button
                        className="btn btn-square btn-xs btn-ghost"
                        onClick={onMoveUp}
                        title="Flyt op"
                    >
                        ↑
                    </button>
                    <button
                        className="btn btn-square btn-xs btn-info"
                        onClick={onCopy}
                        title="Kopiér til kontor"
                    >
                        📋
                    </button>
                    <button
                        className="btn btn-square btn-xs btn-ghost"
                        onClick={onMoveDown}
                        title="Flyt ned"
                    >
                        ↓
                    </button>
                    <button
                        className="btn btn-square btn-xs btn-error"
                        onClick={onDelete}
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
                    onChange={e => onRowChange(row.uid, 'examName', e.target.value)}
                    placeholder="Indtast eksamensnavn"
                    style={{minWidth: `${Math.max(150, row.examName.length * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.attendees.join(', ')}
                    onChange={e => onRowChange(row.uid, 'attendees', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Adskil med komma"
                    style={{minWidth: `${Math.max(150, row.attendees.join(', ').length * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="datetime-local"
                    className="input input-bordered input-sm"
                    value={toDatetimeLocal(row.startDate)}
                    onChange={e => onRowChange(row.uid, 'startDate', fromDatetimeLocal(e.target.value))}
                    style={{width: '170px'}}
                />
            </td>
            <td>
                <input
                    type="datetime-local"
                    className="input input-bordered input-sm"
                    value={toDatetimeLocal(row.endDate)}
                    onChange={e => onRowChange(row.uid, 'endDate', fromDatetimeLocal(e.target.value))}
                    style={{width: '170px'}}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.wiseflowDeadline || ''}
                    onChange={e => onRowChange(row.uid, 'wiseflowDeadline', e.target.value)}
                    placeholder="f.eks. starten af januar"
                    style={{minWidth: `${Math.max(180, (row.wiseflowDeadline?.length || 0) * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.hold || ''}
                    onChange={e => onRowChange(row.uid, 'hold', e.target.value)}
                    placeholder="Hold"
                    style={{minWidth: `${Math.max(120, (row.hold?.length || 0) * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.klasse || ''}
                    onChange={e => onRowChange(row.uid, 'klasse', e.target.value)}
                    placeholder="Klasse"
                    style={{minWidth: `${Math.max(120, (row.klasse?.length || 0) * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="number"
                    className="input input-bordered input-sm"
                    value={row.ects || ''}
                    onChange={e => onRowChange(row.uid, 'ects', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="ECTS"
                    style={{width: '70px'}}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.examType || ''}
                    onChange={e => onRowChange(row.uid, 'examType', e.target.value)}
                    placeholder="Mdt/skr/projekt"
                    style={{minWidth: `${Math.max(120, (row.examType?.length || 0) * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={row.groupSubmission || false}
                    onChange={e => onRowChange(row.uid, 'groupSubmission', e.target.checked)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={row.eksternCensur || false}
                    onChange={e => onRowChange(row.uid, 'eksternCensur', e.target.checked)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={row.tilsyn || false}
                    onChange={e => onRowChange(row.uid, 'tilsyn', e.target.checked)}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.materialeUpload || ''}
                    onChange={e => onRowChange(row.uid, 'materialeUpload', e.target.value)}
                    placeholder="Materiale"
                    style={{minWidth: `${Math.max(120, (row.materialeUpload?.length || 0) * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.lokale || ''}
                    onChange={e => onRowChange(row.uid, 'lokale', e.target.value)}
                    placeholder="Lokale"
                    style={{minWidth: `${Math.max(120, (row.lokale?.length || 0) * 8)}px`}}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    value={row.forplejning || ''}
                    onChange={e => onRowChange(row.uid, 'forplejning', e.target.value)}
                    placeholder="Forplejning"
                    style={{minWidth: `${Math.max(120, (row.forplejning?.length || 0) * 8)}px`}}
                />
            </td>
        </tr>
    );
}
