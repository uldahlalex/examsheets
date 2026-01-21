export interface Row {
    uid: string;
    examName: string;
    attendees: string[],
    startDate: string;
    endDate: string;
    wiseflowDeadline?: string;
    hold?: string;
    klasse?: string;
    ects?: number;
    examType?: string;
    groupSubmission?: boolean;
    eksternCensur?: boolean;
    tilsyn?: boolean;
    materialeUpload?: string;
    lokale?: string;
    forplejning?: string;
}