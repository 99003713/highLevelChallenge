import { NextFunction, Request, Response } from "express";
import logger from "@utils/logger";

export const handler = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    logger.error("common error handler", error);
    console.log(error.message, (error as any).statusCode);
    response.status(500).send({ message: error.message });
};