import { UploadCircular } from "../dtos/upload-circular.dto";
import { ICircular } from "../model/circular.model";

class CircularFactory {
  static uploadCircular(data: UploadCircular) {
    const circular = {} as ICircular;

    circular.title = data.title;
    circular.description = data.description;
    circular.province = data.province;
    circular.category = data.category;
    circular.file = data.file;
    circular.uploadedAt = data.uploadedAt;
    circular.churchId = data.churchId;

    return circular;
  }
}

export default CircularFactory;
