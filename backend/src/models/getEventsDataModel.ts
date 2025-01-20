export interface GetEventsRequest {
    startDate: string;
    endDate: string;
}

export interface GetEventsResponse {
    events: Event[];
}

interface Event {
    createdAt: string;
    duration: number;
    event_end_time: string;
    event_start_time: string;
}