import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const rotateFile: DailyRotateFile = new DailyRotateFile({
  dirname: "logs",
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
});

export const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.printf((info) => `${new Date().toISOString()} [${info.level.toUpperCase()}]: ${info.message}`),
  transports: [rotateFile],
});