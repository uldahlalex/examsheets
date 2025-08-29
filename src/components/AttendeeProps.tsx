export interface AttendeeProps {
    attendee: string;
    setAttendee: (str: string) => void;
    onDelete: () => void;
}