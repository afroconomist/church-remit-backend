import { User } from "src/v1/modules/userManagement/model/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
