import express from "express";
import { container } from "tsyringe";
import AppController from "./app.controller";

const appController = container.resolve(AppController);

const app = express();

app.get("/", appController.getHello);

export default app;
