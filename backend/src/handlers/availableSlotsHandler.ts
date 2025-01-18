import { NextFunction, Request, RequestHandler, Response } from "express";
import { availableSlotsController } from "@/src/controllers/availableSlotsController";
import { STATUS_CODES } from "@/src/utils/response";
import { logger } from "@/src/utils/logger";
import Joi from "joi";

export const availableSlotsHandler: RequestHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    logger.info("availableSlotsHandler Request", request.query);

    // Define Joi Schema for Validation
    const availableSlotsSchema = Joi.object({
      date: Joi.string()
        .isoDate()
        .required(),
      timezone: Joi.string()
        .valid(
          "America/Los_Angeles",
          "America/New_York",
          "Asia/Kolkata",
          "Europe/London"
        ) // Add more valid timezones as needed
        .required()
    });

    // Validate request query parameters
    const { error, value } = availableSlotsSchema.validate(request.query, {
      abortEarly: false,
    });

    if (error) {
      logger.warn("Validation Error in availableSlotsHandler", error.details);
      return response
        .status(500)
        .json({ errors: error.details.map((err) => err.message) });
    }

    // Call controller with validated data
    const availableSlots = await availableSlotsController(value);
    logger.info("availableSlotsHandler Response", availableSlots);

    response.status(STATUS_CODES.OK).json(availableSlots);
  } catch (error) {
    logger.error("Error in availableSlotsHandler", error);
    next(error);
  }
};