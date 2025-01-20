import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { CreateEventRequest, CreateEventResponse } from "@models/createEventDataModel";
import { eventAlreadyExists, invalidRequest } from "@utils/errorCodes";

const DR_DURATION = Number(process.env.DR_DURATION) || 30;
const DR_TIMEZONE = process.env.DR_TIMEZONE || "America/Los_Angeles";
const DR_START_HOUR = Number(process.env.DR_START_HOUR) || 10;
const DR_END_HOUR = Number(process.env.DR_END_HOUR) || 17;

export const createEventController = async (request: CreateEventRequest): Promise<CreateEventResponse> => {
    try {
        logger.info("createEventController Request", { request });

        const { dateTime, duration } = request;

        const eventStartUTC = moment.utc(dateTime);
        const eventStartEastern = eventStartUTC.clone().tz(DR_TIMEZONE);
        const eventEndEastern = eventStartEastern.clone().add(duration, "minutes");

        logger.info("Converted UTC to Eastern Time", { 
            eventStartEastern: eventStartEastern.format(), 
            eventEndEastern: eventEndEastern.format() 
        });

        if (eventStartEastern.hour() < DR_START_HOUR || eventEndEastern.hour() > DR_END_HOUR || duration !== DR_DURATION) {
            logger.error("Event outside of working hours", { eventStartEastern: eventStartEastern.format(), eventEndEastern: eventEndEastern.format() });
            throw new Error(JSON.stringify(invalidRequest));
        }

        const eventEndUTC = eventEndEastern.clone().utc();

        if (eventStartUTC.isBefore(moment.utc())) {
            throw new Error(JSON.stringify(invalidRequest));
        }

        const eventQuerySnapshot = await db.collection("events")
            .where("event_start_time", "<", eventEndUTC.toDate())
            .where("event_end_time", ">", eventStartUTC.toDate())
            .get();

        if (!eventQuerySnapshot.empty) {
            throw new Error(JSON.stringify(eventAlreadyExists));
        }

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