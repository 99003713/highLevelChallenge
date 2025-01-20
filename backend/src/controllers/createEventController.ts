import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { CreateEventRequest, CreateEventResponse } from "@models/createEventDataModel";
import { eventAlreadyExists, invalidRequest } from "@utils/errorCodes";

export const createEventController = async (request: CreateEventRequest): Promise<CreateEventResponse> => {
    try {
        logger.info("createEventController Request", { request });

        const { dateTime, duration } = request;

        // Explicitly parse the input as UTC
        const eventStartUTC = moment.utc(dateTime);  // Ensures input is always treated as UTC
        const eventEndUTC = eventStartUTC.clone().add(duration, "minutes");

        // Check if the event is in the past (UTC-based check)
        if (eventStartUTC.isBefore(moment.utc())) {
            throw new Error(JSON.stringify(invalidRequest));
        }

        logger.info("Creating Event in UTC", { 
            eventStartUTC: eventStartUTC.format(), 
            eventEndUTC: eventEndUTC.format(), 
            duration 
        });

        // Query Firestore for overlapping events
        const eventQuerySnapshot = await db.collection("events")
            .where("event_start_time", "<", eventEndUTC.toDate())  // Event ends after new event starts
            .where("event_end_time", ">", eventStartUTC.toDate())  // Event starts before new event ends
            .get();

        if (!eventQuerySnapshot.empty) {
            throw new Error(JSON.stringify(eventAlreadyExists));
        }

        // Store event in Firestore with UTC timestamps
        await db.collection("events").add({
            event_start_time: eventStartUTC.toDate(),  // Store in UTC
            event_end_time: eventEndUTC.toDate(),      // Store in UTC
            duration,
            createdAt: moment.utc().toDate(),         // Ensure createdAt is also in UTC
        });

        logger.info("Event created successfully", { 
            eventStartUTC: eventStartUTC.format(), 
            eventEndUTC: eventEndUTC.format() 
        });

        return { message: "Event created successfully" };

    } catch (error) {
        logger.error("Error in createEventController", error);
        throw error;
    }
};