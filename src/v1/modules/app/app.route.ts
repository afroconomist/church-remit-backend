import express, { Response } from "express";
import { container } from "tsyringe";
import AppController from "./app.controller";

const appController = container.resolve(AppController);

const app = express();

app.get("/", (res: Response) => {
  appController.getHello(res);
});

export default app;
