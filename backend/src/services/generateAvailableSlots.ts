import moment from "moment-timezone";

export const generateAvailableSlots = (date: string, startHour: number, endHour: number, duration: number, timezone: string, bookedSlots: string[]) => {
  const slots: string[] = [];
  let time = moment.tz(`${date} ${startHour}:00`, "YYYY-MM-DD HH:mm", timezone);

  while (time.hour() < endHour) {
    const slot = time.format();
    if (!bookedSlots.includes(slot)) {
      slots.push(slot);
    }
    time.add(duration, "minutes");
  }

  return slots;
};