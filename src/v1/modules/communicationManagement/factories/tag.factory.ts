import slugify from "slugify";
import { CreateTag } from "../dtos/create-tag.dto";
import { ITag } from "../model/tag.model";

class TagFactory {
  static createTag(data: CreateTag) {
    const tag = {} as ITag;

    tag.tagName = data.tagName;
    tag.description = data.description;
    tag.color = data.color;
    tag.defaultAssignment = data.defaultAssignment;
    tag.slug = slugify(data.tagName, { lower: true });
    tag.campusId = data.campusId;
    tag.churchId = data.churchId;

    return tag;
  }
}

export default TagFactory;
