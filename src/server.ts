import App from "./app";
import appConfig from "./config/app.config";
import logger from "./shared/utils/logger";

const app = new App();


process
  .on("uncaughtException", (err) => {
    logger.error({ err });
    app.close();
    process.exit(1);
  })
  .on("SIGINT", () => {
    app.close();
    process.exit(0);
  });

app.listen(appConfig.server.port, "0.0.0.0").on("error", (err) => {
  logger.error({ err });
  process.exit(1);
});
