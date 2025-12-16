import "reflect-metadata";
import "dotenv/config";
import "module-alias/register";
import express from "express";
import http from "http";
import {
  bootstrapApp,
  setErrorHandler,
  setUndefinedRoutesErrorHandler,
} from "./bootstrap";
import RouteVersion from "@config/route.config";
import routes from "./shared/routes/index.routes";
import logger from "@shared/utils/logger";
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { QueueService } from "./v1/modules/userManagement/queues/wallet-creation.queue";
import { container } from "tsyringe";

class App {
  private app: express.Application;
  private server: http.Server;

  constructor() {
    this.app = express();

    bootstrapApp(this.app);
    this.registerModules();
    this.globalErrorHandler();
    this.undefinedRoutesErrorHandler();
    this.registerBullBoard(); // Register Bull Board here
    this.server = http.createServer(this.app);
  }

  private registerModules() {
    // this.app.use(routes.app);
    this.app.use(routes.health);
    this.app.use(RouteVersion.v1, routes.auditTrail);
    this.app.use(RouteVersion.v1, routes.auth);
    this.app.use(RouteVersion.v1, routes.userManagement);
    this.app.use(RouteVersion.v1, routes.accessControl);
    this.app.use(RouteVersion.v1, routes.walletManagement);
    this.app.use(RouteVersion.v1, routes.churchManagement);
    this.app.use(RouteVersion.v1, routes.memberManagement);
    // this.app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
    //   res.status(200).send("Church Remit API is running");
    // });
  }

  private registerBullBoard() {
    const queueService = container.resolve(QueueService);
    const walletCreationQueue = queueService.getWalletCreationQueue();

    // Create Express adapter
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    // Create Bull Board
    createBullBoard({
      queues: [new BullAdapter(walletCreationQueue)],
      serverAdapter: serverAdapter,
    });

    this.app.use('/admin/queues', serverAdapter.getRouter());
  }

  public getInstance() {
    return this.app;
  }

  private globalErrorHandler() {
    setErrorHandler(this.app);
  }

  private undefinedRoutesErrorHandler() {
    setUndefinedRoutesErrorHandler(this.app);
  }

  public async close() {
    if (this.server) {
      this.server.close();
    }
  }

  public listen(port: number, address = "0.0.0.0") {
    return this.server.listen(port, address, () => {
      logger.info(`Server listening on ${address}:${port}`);
    });
  }
}

export default App;
