import {format} from "date-fns";
import {formatStr} from "../../models/FormatStr.tsx";
import type {Row} from "../../models/Row.tsx";

interface SheetToolbarProps {
    onAddRow: () => void;
    showImport: boolean;
    setShowImport: (show: boolean) => void;
    showAttendees: boolean;
    setShowAttendees: (show: boolean) => void;
    showClasses: boolean;
    setShowClasses: (show: boolean) => void;
    attendeesCount: number;
    classesCount: number;
    order: string;
    setOrder: (order: string) => void;
}

export function SheetToolbar({
    onAddRow,
    showImport,
    setShowImport,
    showAttendees,
    setShowAttendees,
    showClasses,
    setShowClasses,
    attendeesCount,
    classesCount,
    order,
    setOrder
}: SheetToolbarProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                className="btn btn-primary btn-sm"
                onClick={onAddRow}
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
                Bedømmere ({attendeesCount})
            </button>
            <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowClasses(!showClasses)}
            >
                Klasser ({classesCount})
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
    );
}
