import Logger from ".";
import { getLogLevelFromStatusCode } from "./util";

function logRequest(req, res, next) {
  res.on("finish", () => {
    const logLevel = getLogLevelFromStatusCode(res.statusCode);

    Logger[logLevel]({
      req: req,
      res: res,
    });
  });

  next();
}

function addPayloadToResponse(res, next) {
  // Middleware to handle payload processing before sending the response
  const originalSend = res.send;
  res.send = function (body) {
    Object.assign(res, { payload: body });
    return originalSend.call(this, body);
  };

  next();
}

export default function loggerPlugin(app) {
  app.use(addPayloadToResponse);
  app.use(logRequest);
}
