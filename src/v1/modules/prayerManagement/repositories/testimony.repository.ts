import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Testimony, ITestimony } from "../model/testimony.model";

@injectable()
class TestimonyRepository extends BaseRepository<ITestimony, Testimony> {
  constructor() {
    super(Testimony);
  }
}

export default TestimonyRepository;
