import { db } from "@config/firebase";
import moment from "moment-timezone";
import { generateAvailableSlots } from "@services/generateAvailableSlots";
import { missingDate } from "@utils/errorCodes";
import { logger } from "@utils/logger"

export const availableSlotsController = async (request: any) => {
  try {
    logger.info("availableSlotsController", { request });
    const { date, timezone = (process.env as any).DEFAULT_TIMEZONE } = request;
    if (!date) {
      throw new Error(JSON.stringify(missingDate));
    }

    const formattedDate = moment.tz(date, timezone).format("YYYY-MM-DD");
    const bookedSlotsSnap = await db.collection("events").where("date", "==", formattedDate).get();
    const bookedSlots = bookedSlotsSnap.docs.map(doc => doc.data().time);

    const availableSlots = generateAvailableSlots(formattedDate, (process.env as any).START_HOUR, (process.env as any).END_HOUR, (process.env as any).DURATION, timezone, bookedSlots);
    return availableSlots
  } catch (error) {
    logger.error("Error in availableSlotsController", error);
    throw error;
  }
};