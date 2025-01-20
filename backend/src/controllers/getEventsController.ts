import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { GetEventsRequest, GetEventsResponse } from "@models/getEventsDataModel";
import { invalidRequest } from "@utils/errorCodes";

export const getEventsController = async (request: GetEventsRequest): Promise<GetEventsResponse> => {
    try {
        logger.info("getEventsController Request", { request });

        const { startDate, endDate } = request;

        // Validate input format (YYYY-MM-DD)
        if (!moment(startDate, "YYYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid()) {
            throw new Error(JSON.stringify(invalidRequest));
        }

        // Convert to UTC start and end timestamps
        const startUTC = moment.utc(startDate, "YYYY-MM-DD").startOf("day"); // 00:00 UTC
        const endUTC = moment.utc(endDate, "YYYY-MM-DD").endOf("day"); // 23:59:59 UTC

        logger.info("Fetching Events in UTC Range", {
            startUTC: startUTC.format(),
            endUTC: endUTC.format()
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
                event_start_time: moment.unix(data.event_start_time._seconds).utc().format("YYYY-MM-DD HH:mm:ss"),
                event_end_time: moment.unix(data.event_end_time._seconds).utc().format("YYYY-MM-DD HH:mm:ss"),
                duration: data.duration,
                createdAt: moment.unix(data.createdAt._seconds).utc().format("YYYY-MM-DD HH:mm:ss"),
            };
        });

        logger.info("Fetched Events", { count: events.length });

        //@ts-ignore
        return { events: events };

    } catch (error) {
        logger.error("Error in getEventsController", error);
        throw error;
    }
};