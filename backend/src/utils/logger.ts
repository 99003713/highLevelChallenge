import * as winston from "winston";
import {
  getApiNameFromContext,
  getRequestIdFromContext,
} from "./context";

/**
 * It was getting very hard to add types to this function :(
 */
const myFormatterWithRequestId = winston.format((info) => {
  info.requestId = getRequestIdFromContext();
  info.apiName = getApiNameFromContext();
  return info;
});

const getLogingFormat = (): winston.Logform.Format => {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    myFormatterWithRequestId(),
    process.env.NODE_ENV === "local"
      ? winston.format.prettyPrint()
      : winston.format.json(),
  );
};

/**
 * Use this logger only for request / response logging otherwise context will be lost in case of any other logging
 */
export const logger: winston.Logger = winston.createLogger({
  format: getLogingFormat(),
  defaultMeta: {
    serviceName: "appointment-service",
  },
  transports: [new winston.transports.Console()],
});

export default logger;