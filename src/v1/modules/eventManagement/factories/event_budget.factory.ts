import { CreateEventBudget } from "../dtos/event-budget.dto";
import { IEventBudget } from "../model/event_budget.model";

class EventBudgetFactory {
  static createEventBudget(data: CreateEventBudget) {
    const eventBudget = {} as IEventBudget;

    eventBudget.category = data.category;
    eventBudget.itemDescription = data.itemDescription;
    eventBudget.budgetedAmount = data.budgetedAmount;
    eventBudget.actualAmount = 0;
    eventBudget.variance = 0;
    eventBudget.status = "pending";
    eventBudget.eventId = data.eventId;

    return eventBudget;
  }
}

export default EventBudgetFactory;
