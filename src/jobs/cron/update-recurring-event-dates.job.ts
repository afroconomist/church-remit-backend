import cron from "node-cron";
import logger from "@shared/utils/logger";
import { container } from "tsyringe";
import EventService from "../../v1/modules/eventManagement/services/event.service";

export const updateRecurringEventDatesJob = cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      logger.info("Updating recurring event dates");

      const eventService = container.resolve(EventService);
      const result = await eventService.updateRecurringEventDates();

      logger.info({ result }, "Successfully updated recurring event dates");
    } catch (error: any) {
      logger.error(
        { error: error.message },
        "Error occurred while updating recurring event dates",
      );
    }
  },
);
