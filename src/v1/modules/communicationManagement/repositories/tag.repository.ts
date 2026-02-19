import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Tag, ITag } from "../model/tag.model";

@injectable()
class TagRepository extends BaseRepository<ITag, Tag> {
  constructor() {
    super(Tag);
  }
}

export default TagRepository;
