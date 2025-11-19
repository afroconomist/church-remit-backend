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
import { BullAdapter } from 'bull-board/bullAdapter';
import { createBullBoard } from 'bull-board';
import { QueueService } from "./v1/modules/userManagement/queues/wallet-creation.queue";
import { container } from "tsyringe";

class App {
	private app: express.Application;
	private server: http.Server;

	constructor() {
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.json({ limit: '100mb' }));
    this.app.use(express.urlencoded({ limit: '100mb', extended: true }));

    bootstrapApp(this.app);
    this.registerModules();
    this.globalErrorHandler();
    this.undefinedRoutesErrorHandler();
    this.registerBullBoard();
    this.server = http.createServer(this.app);
	}

	private registerModules() {
		this.app.use(routes.app);
		this.app.use(routes.health);
		this.app.use(RouteVersion.v1, routes.auditTrail);
		this.app.use(RouteVersion.v1, routes.auth);
		this.app.use(RouteVersion.v1, routes.userManagement);
		this.app.use(RouteVersion.v1, routes.externalService);
		this.app.use(RouteVersion.v1, routes.accessControl);
		this.app.use(RouteVersion.v1, routes.policyManagement);
		this.app.use(RouteVersion.v1, routes.walletManagement);
	}

	private registerBullBoard() {
		const queueService = container.resolve(QueueService);
		const walletCreationQueue = queueService.getWalletCreationQueue();
	  
		const { router } = createBullBoard([new BullAdapter(walletCreationQueue)]);
	  
		this.app.use('/admin/queues', router);
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