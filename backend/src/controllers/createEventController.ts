import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { CreateEventRequest, CreateEventResponse } from "@models/createEventDataModel";
import { eventAlreadyExists, invalidRequest } from "@utils/errorCodes";

export const createEventController = async (request: CreateEventRequest): Promise<CreateEventResponse> => {
    try {
        logger.info("createEventController Request", { request });

        const { dateTime, duration } = request;

        // Convert input date to UTC
        const event_start_time = moment.tz(dateTime, "YYYY-MM-DDTHH:mm:ss", "UTC").utc();
        const event_end_time = event_start_time.clone().add(duration, "minutes");

        // Check if the event date is in the past
        if (event_start_time.isBefore(moment.utc())) {
            throw new Error(JSON.stringify(invalidRequest));
        }

        logger.info("Checking for overlapping events", { event_start_time: event_start_time.format(), event_end_time: event_end_time.format() });

        // Query Firestore for events that might overlap
        //created a Composite INDEX in firestore for event_start_time and event_end_time
        const eventQuerySnapshot = await db.collection("events")
            .where("event_start_time", "<", event_end_time.toDate())  // Any event that starts before new event ends
            .where("event_end_time", ">", event_start_time.toDate())  // Any event that ends after new event starts
            .get();

        if (!eventQuerySnapshot.empty) {
            throw new Error(JSON.stringify(eventAlreadyExists));
        }

        // Store the event in UTC format
        await db.collection("events").add({
            event_start_time: event_start_time.toDate(),
            event_end_time: event_end_time.toDate(),
            duration,
            createdAt: moment.utc().toDate(),
        });

        logger.info("Event created successfully", { event_start_time: event_start_time.format(), event_end_time: event_end_time.format(), duration });
        return { message: "Event created successfully" };
    } catch (error) {
        logger.error("Error in createEventController", error);
        throw error;
    }
};
