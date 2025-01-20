import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { AvailableSlotsRequest, AvailableSlotsResponse } from "@models/availableSlotsDataModel";
import { invalidRequest } from "@utils/errorCodes";

const SLOT_DURATION = (process.env as any).DR_DURATION || 30;
const DOCTOR_TIMEZONE = (process.env as any).DR_TIMEZONE || "US/Eastern";
const START_HOUR = (process.env as any).DR_START_HOUR || 8;
const END_HOUR = (process.env as any).DR_END_HOUR || 17;

const isConflicting = (
  slotStart: moment.Moment,
  slotEnd: moment.Moment,
  bookedSlots: { start: moment.Moment, end: moment.Moment }[]
) => {
  return bookedSlots.some(({ start, end }) =>
    slotStart.isBefore(end) && slotEnd.isAfter(start)
  );
};

const generateAvailableSlots = (
  doctorStartUTC: moment.Moment,
  doctorEndUTC: moment.Moment,
  bookedSlots: { start: moment.Moment, end: moment.Moment }[],
  requestedDate: string, 
  timezone: string
) => {
  const availableSlots: string[] = [];
  let currentTime = doctorStartUTC.clone();

  while (currentTime.isBefore(doctorEndUTC)) {
    const slotEnd = currentTime.clone().add(SLOT_DURATION, "minutes");

    // Convert to the patient's timezone
    const slotLocal = currentTime.clone().tz(timezone);
    const slotEndLocal = slotEnd.clone().tz(timezone);

    // Ensure slots belong to the requested date in patient's timezone
    if (!slotLocal.isSame(moment.tz(requestedDate, timezone), "day")) {
      break;
    }

    if (!isConflicting(currentTime, slotEnd, bookedSlots)) {
      availableSlots.push(slotLocal.format("YYYY-MM-DDTHH:mm:ss"));
    }

    currentTime.add(SLOT_DURATION, "minutes");
  }

  return availableSlots;
};

export const availableSlotsController = async (request: AvailableSlotsRequest): Promise<AvailableSlotsResponse> => {
  try {
    logger.info("Available Slots Request", { request });

    const { date, timezone } = request;

    const patientDateLocal = moment.tz(date, timezone).startOf("day");
    const currentDateLocal = moment.tz(timezone).startOf("day");

    if (patientDateLocal.isBefore(currentDateLocal)) {
      throw new Error(JSON.stringify(invalidRequest));
    }

    const doctorDateLocal = moment.tz(date, DOCTOR_TIMEZONE).startOf("day");
    const doctorStartLocal = doctorDateLocal.clone().set({ hour: START_HOUR, minute: 0 });
    const doctorEndLocal = doctorDateLocal.clone().set({ hour: END_HOUR, minute: 0 });

    const doctorStartUTC = doctorStartLocal.clone().utc();
    const doctorEndUTC = doctorEndLocal.clone().utc();

    const bookedSlotsSnap = await db
      .collection("events")
      .where("event_start_time", "<", doctorEndUTC.toDate())
      .where("event_end_time", ">", doctorStartUTC.toDate())
      .get();

    const bookedSlots = bookedSlotsSnap.docs.map(doc => {
      const eventData = doc.data();
      return { start: moment.utc(eventData.event_start_time.toDate()), end: moment.utc(eventData.event_end_time.toDate()) };
    });

    return {
      date: moment.tz(date, timezone).format("YYYY-MM-DD"),
      availableSlots: generateAvailableSlots(doctorStartUTC, doctorEndUTC, bookedSlots, date, timezone)
    };
  } catch (error) {
    logger.error("Error in availableSlotsController", error);
    throw error;
  }
};