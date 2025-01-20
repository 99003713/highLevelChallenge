import { db } from "@config/firebase";
import moment from "moment-timezone";
import { logger } from "@utils/logger";
import { AvailableSlotsRequest, AvailableSlotsResponse } from "@models/availableSlotsDataModel";
import { invalidRequest } from "@utils/errorCodes";

const SLOT_DURATION = Number(process.env.DR_DURATION) || 30; // Fixed slot duration (in minutes)
const DOCTOR_TIMEZONE = process.env.DR_TIMEZONE || "America/Los_Angeles";
const START_HOUR = Number(process.env.DR_START_HOUR) || 10;
const END_HOUR = Number(process.env.DR_END_HOUR) || 17;

/**
 * Checks if the given slot conflicts with an already booked slot
 */
const isConflicting = (
  slotStart: moment.Moment,
  bookedSlots: { start: moment.Moment, end: moment.Moment }[]
) => {
  return bookedSlots.some(({ start, end }) =>
    slotStart.isBetween(start, end, null, "[)") // Check if start time falls within any booked slot
  );
};

/**
 * Generate available slots based on fixed intervals while skipping booked slots dynamically.
 */
const generateAvailableSlots = (
  doctorStartUTC: moment.Moment,
  doctorEndUTC: moment.Moment,
  bookedSlots: { start: moment.Moment, end: moment.Moment }[]
) => {
  logger.info("Generating Available Slots", { doctorStartUTC: doctorStartUTC.format(), doctorEndUTC: doctorEndUTC.format(), bookedSlots });

  const availableSlots: string[] = [];
  let currentTime = doctorStartUTC.clone();

  while (currentTime.isBefore(doctorEndUTC)) {
    if (!isConflicting(currentTime, bookedSlots)) {
      availableSlots.push(currentTime.format("YYYY-MM-DDTHH:mm:ss"));
    }

    // Move to next slot interval
    currentTime.add(SLOT_DURATION, "minutes");
  }

  logger.info("Available Slots Generated", { availableSlots });
  return availableSlots;
};

/**
 * Available Slots Controller - Fetches booked slots and generates available slots
 */
export const availableSlotsController = async (request: AvailableSlotsRequest): Promise<AvailableSlotsResponse> => {
  try {
    logger.info("Available Slots Request", { request });

    const { date, timezone } = request;

    // Convert patient's date to the doctor's timezone
    const patientDateLocal = moment.tz(date, timezone).startOf("day");
    const currentDateLocal = moment.tz(timezone).startOf("day");

    // Check if the event date is in the past
    if (patientDateLocal.isBefore(currentDateLocal)) {
      throw new Error(JSON.stringify(invalidRequest))
    }
    const doctorDateLocal = patientDateLocal.clone().tz(DOCTOR_TIMEZONE);

    // Set doctor's available working hours in local timezone
    const doctorStartLocal = doctorDateLocal.clone().set({ hour: START_HOUR, minute: 0, second: 0, millisecond: 0 });
    const doctorEndLocal = doctorDateLocal.clone().set({ hour: END_HOUR, minute: 0, second: 0, millisecond: 0 });
    logger.info("Doctor's Availability in Local Timezone", {
      start: doctorStartLocal.format(),
      end: doctorEndLocal.format(),
    });

    // Convert doctor's working hours to UTC for database querying
    const doctorStartUTC = doctorStartLocal.utc();
    const doctorEndUTC = doctorEndLocal.utc();

    logger.info("Doctor's Availability in UTC", {
      start: doctorStartUTC.format(),
      end: doctorEndUTC.format(),
    });

    // Query Firestore for booked slots within this range
    const bookedSlotsSnap = await db
      .collection("events")
      .where("date", ">=", doctorStartUTC.toDate())
      .where("date", "<=", doctorEndUTC.toDate())
      .get();

    // Extract booked slots including variable durations
    const bookedSlots = bookedSlotsSnap.docs.map(doc => {
      const eventData = doc.data();
      return {
        start: moment.utc(eventData.event_start_time.toDate()),
        end: moment.utc(eventData.event_end_time.toDate()),
      };
    });

    logger.info("Booked Slots", { bookedSlots });

    // Generate available slots while skipping booked time
    const availableSlotsInUTC = generateAvailableSlots(doctorStartUTC, doctorEndUTC, bookedSlots);

    // Convert each available UTC slot to the patient's timezone and filter out previous day slots
    const availableSlots = availableSlotsInUTC
      .map(slot => moment.utc(slot).tz(timezone)) // Convert each slot to patient's timezone
      .filter(slot => slot.isSame(moment.tz(date, timezone), "day")) // Remove slots from the previous day
      .map(slot => slot.format("YYYY-MM-DDTHH:mm:ss"));

    return {
      date: moment.tz(date, timezone).format("YYYY-MM-DD"),
      availableSlots,
    };
  } catch (error) {
    logger.error("Error in availableSlotsController", error);
    throw error;
  }
};