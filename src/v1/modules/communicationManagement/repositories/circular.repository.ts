import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Circular, ICircular } from "../model/circular.model";

@injectable()
class CircularRepository extends BaseRepository<ICircular, Circular> {
  constructor() {
    super(Circular);
  }
}

export default CircularRepository;
