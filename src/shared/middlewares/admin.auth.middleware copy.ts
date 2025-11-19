import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";

const adminAuthMiddleware = (req: Request, res: Response, done) => {
  try {
    const authToken = getAuthTokenFromRequestHeader(req);
    if (!authToken) {
      throw new Error();
    }

    const payload = jwt.decode(authToken);

    (req as any).user = payload.user;

    done();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send(ErrorResponse("You are unauthorized"));
  }
};

const getAuthTokenFromRequestHeader = (req: Request): string | null => {
  const authTokenSegments = (req.headers.authorization || "").split(" ");

  return authTokenSegments.length === 2 ? authTokenSegments[1] : null;
};

export default adminAuthMiddleware;
