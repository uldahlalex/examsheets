// Sample data for demo - matching Handsontable structure
import type {Row} from "../types/row.ts";

export const sampleExams: Row[] = [
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