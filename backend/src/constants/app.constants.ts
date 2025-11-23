import { appConfig } from "src/config/app.config";

export const swaggerInfo = {
  title: "Lead Tracking Api Documentation",
  description: "Lead Tracking Api Documentation to test and review APIs",
};
export const globalPrefix = "api";
export const allowedOrigins = JSON.parse(appConfig.allowedOrigins);
