export interface AvailableSlotsRequest {
    date: string;
    timezone: string;
}

export interface AvailableSlotsResponse {
    date: string
    availableSlots: string[];
}