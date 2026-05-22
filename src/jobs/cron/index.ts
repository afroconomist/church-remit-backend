import logger from "@shared/utils/logger";
import { updateRecurringEventDatesJob } from "./update-recurring-event-dates.job";

export function initializeCronJobs() {
  try {
    logger.info("Initializing cron jobs...");

    updateRecurringEventDatesJob;

    logger.info("All cron jobs initialized successfully");
  } catch (error: any) {
    logger.error({ error: error.message }, "Error initializing cron jobs");
    throw error;
  }
}

export { updateRecurringEventDatesJob };
