export interface CreateEventRequest {
    dateTime: string;
    duration: number;
    timezone: string;
}

export interface CreateEventResponse {
    message: string;
}