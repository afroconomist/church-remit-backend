import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { EventBudget, IEventBudget } from "../model/event_budget.model";

@injectable()
class EventBudgetRepository extends BaseRepository<IEventBudget, EventBudget> {
  constructor() {
    super(EventBudget);
  }
}

export default EventBudgetRepository;
