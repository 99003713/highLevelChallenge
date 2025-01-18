import { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import * as error from "@middlewares/error";
import { availableSlotsHandler } from "@handlers/availableSlotsHandler";
// import { createEvent } from "@controllers/createEventController";
// import { getEvents } from "@controllers/getEventsController";

dotenv.config();

const app = express();

app.use(helmet()); 
app.use(cors());
app.use(express.json());

const router = express.Router();
const BASE_PATH = process.env.BASE_PATH || "/appointment";
app.use(BASE_PATH, router);

router.get("/free-slots", availableSlotsHandler);
// router.post("/create-event", createEvent);
// router.get("/events", getEvents);

// Catch All Error Handler
router.use(error.handler);

// Emty route handler
router.all("*", (req: Request, res: Response) => {
  res.status(404).send("What are you trying to access ??");
});

export default app;