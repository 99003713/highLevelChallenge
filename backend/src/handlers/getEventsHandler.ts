import { NextFunction, Request, RequestHandler, Response } from "express";
import { getEventsController } from "@controllers/getEventsController";
import { STATUS_CODES } from "@utils/response";
import { logger } from "@utils/logger";
import Joi from "joi";
import { GetEventsResponse } from "@models/getEventsDataModel";

export const getEventsHandler: RequestHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        logger.info("getEventsHandler Request", { query: request.query });

        // Define Joi Schema for Validation
        const getEventsSchema = Joi.object({
            startDate: Joi.string()
                .pattern(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD format
                .required(),
            endDate: Joi.string()
                .pattern(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD format
                .required(),
        });

        // Validate request query parameters
        const { error, value } = getEventsSchema.validate(request.query, {
            abortEarly: false,
        });

        if (error) {
            logger.error("Validation Error in getEventsHandler", error.details);
            return response
                .status(STATUS_CODES.INTERNAL_SERVER_ERROR )
                .json({ errors: error.details.map((err) => err.message) });
        }

        // Call controller with validated data
        const getEventsRes: GetEventsResponse = await getEventsController(value);
        logger.info("getEventsHandler Response", getEventsRes);

        response.status(STATUS_CODES.OK).json(getEventsRes);
    } catch (error) {
        logger.error("Error in getEventsHandler", error);
        next(error);
    }
};