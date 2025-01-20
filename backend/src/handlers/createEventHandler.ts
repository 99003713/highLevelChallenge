import { NextFunction, Request, RequestHandler, Response } from "express";
import { createEventController } from "@controllers/createEventController";
import { STATUS_CODES } from "@utils/response";
import { logger } from "@utils/logger";
import Joi from "joi";
import { CreateEventResponse } from "@models/createEventDataModel";

export const createEventHandler: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        logger.info("createEventHandler Request", { body: request.body });

        // Define Joi Schema for Validation
        const createEventSchema = Joi.object({
            dateTime: Joi.string()
                .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
                .required(),
            duration: Joi.number()
                .integer()
                .positive()
                .required(),
            timezone: Joi.string()
                .valid(
                    "America/Los_Angeles",
                    "America/New_York",
                    "Asia/Kolkata",
                    "Europe/London",
                    "US/Eastern",
                    "UTC",
                    "Australia/Sydney",
                    "Pacific/Auckland",
                    "Etc/UTC",
                    "Etc/GMT+12"
                ) // Add more valid timezones as needed    
        });

        // Validate request query parameters
        const { error, value } = createEventSchema.validate(request.body, {
            abortEarly: false,
        });

        if (error) {
            logger.error("Validation Error in createEventHandler", error.details);
            return response
                .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json({ errors: error.details.map((err) => err.message) });
        }

        // Call controller with validated data
        const createEventRes: CreateEventResponse = await createEventController(value);
        logger.info("createEventHandler Response", createEventRes);

        response.status(STATUS_CODES.OK).json(createEventRes);
    } catch (error) {
        logger.error("Error in createEventHandler", error);
        next(error);
    }
};