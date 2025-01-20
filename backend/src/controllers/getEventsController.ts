import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { GetEventsRequest, GetEventsResponse } from "@models/getEventsDataModel";
import { invalidRequest } from "@utils/errorCodes";

const DR_TIMEZONE = (process.env as any).DR_TIMEZONE || "US/Eastern";

export const getEventsController = async (request: GetEventsRequest): Promise<GetEventsResponse> => {
    try {
        logger.info("getEventsController Request", { request });

        const { startDate, endDate } = request;

        // Validate input format (YYYY-MM-DD)
        if (!moment(startDate, "YYYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid()) {
            throw new Error(JSON.stringify(invalidRequest));
        }

        // Convert start and end date from DR_TIMEZONE to UTC
        const startUTC = moment.tz(startDate, "YYYY-MM-DD", DR_TIMEZONE).startOf("day").utc();
        const endUTC = moment.tz(endDate, "YYYY-MM-DD", DR_TIMEZONE).endOf("day").utc();

        logger.info("Fetching Events in UTC Range", {
            startUTC: startUTC.format(),
            endUTC: endUTC.format(),
            requesterTimezone: DR_TIMEZONE
        });

        // Query Firestore for events within the given range
        const eventQuerySnapshot = await db.collection("events")
            .where("event_start_time", ">=", startUTC.toDate())
            .where("event_start_time", "<=", endUTC.toDate())
            .get();

        const events = eventQuerySnapshot.docs.map((doc) => {
            const data = doc.data();

            return {
                id: doc.id,
                event_start_time: moment(data.event_start_time.toDate()).tz(DR_TIMEZONE).format("YYYY-MM-DD HH:mm:ss"),
                event_end_time: moment(data.event_end_time.toDate()).tz(DR_TIMEZONE).format("YYYY-MM-DD HH:mm:ss"),
                duration: data.duration,
                createdAt: moment(data.createdAt.toDate()).tz(DR_TIMEZONE).format("YYYY-MM-DD HH:mm:ss"),
            };
        });

        logger.info("Fetched Events", { count: events.length });

        return { events };

    } catch (error) {
        logger.error("Error in getEventsController", error);
        throw error;
    }
};