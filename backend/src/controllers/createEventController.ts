import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { CreateEventRequest, CreateEventResponse } from "@models/createEventDataModel";
import { eventAlreadyExists, invalidRequest } from "@utils/errorCodes";

const DR_TIMEZONE = (process.env as any).DR_TIMEZONE || "US/Eastern";
const DR_START_HOUR = (process.env as any).DR_START_HOUR || 8;
const DR_END_HOUR = (process.env as any).DR_END_HOUR || 17;

export const createEventController = async (request: CreateEventRequest): Promise<CreateEventResponse> => {
    try {
        logger.info("createEventController Request", { request });

        const { dateTime, duration, timezone } = request;

        // Parse request datetime in pattient's timezone
        const eventStartLocal = moment.tz(dateTime, timezone);
        // Convert to UTC for storage
        const eventStartUTC = eventStartLocal.clone().utc();
        const eventEndUTC = eventStartUTC.clone().add(duration, "minutes");

        // Convert to DR_TIMEZONE (Doctor's Timezone) for validation
        const eventStartEastern = eventStartUTC.clone().tz(DR_TIMEZONE);
        const eventEndEastern = eventEndUTC.clone().tz(DR_TIMEZONE);

        logger.info("Converted Local Time to UTC", {
            eventStartLocal: eventStartLocal.format(),
            eventStartUTC: eventStartUTC.format(),
            eventStartEastern: eventStartEastern.format(),
            eventEndEastern: eventEndEastern.format(),
        });

        // Validate working hours in DR_TIMEZONE
        if (eventStartEastern.hour() < DR_START_HOUR || eventEndEastern.hour() > DR_END_HOUR) {
            logger.error("Event outside of working hours", { 
                eventStartEastern: eventStartEastern.format(), 
                eventEndEastern: eventEndEastern.format() 
            });
            throw new Error(JSON.stringify(invalidRequest));
        }

        // Prevent booking past events
        if (eventStartUTC.isBefore(moment.utc())) {
            throw new Error(JSON.stringify(invalidRequest));
        }

        // Check for existing events in UTC
        const eventQuerySnapshot = await db.collection("events")
            .where("event_start_time", "<", eventEndUTC.toDate())
            .where("event_end_time", ">", eventStartUTC.toDate())
            .get();

        if (!eventQuerySnapshot.empty) {
            throw new Error(JSON.stringify(eventAlreadyExists));
        }

        // Store event in UTC
        await db.collection("events").add({
            event_start_time: eventStartUTC.toDate(),
            event_end_time: eventEndUTC.toDate(),
            duration,
            createdAt: moment.utc().toDate(),
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