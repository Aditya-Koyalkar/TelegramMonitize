import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import { PADDLE_API_KEY } from "../env.js";

const paddle = new Paddle(PADDLE_API_KEY, {
  environment: Environment.sandbox, // or Environment.sandbox for accessing sandbox API
  logLevel: LogLevel.verbose, // or LogLevel.error for less verbose logging
});

export default paddle;
