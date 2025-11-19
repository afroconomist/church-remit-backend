import httpStatus from "http-status";
import AppError from "./app.error";

export default class NotFoundError extends AppError {
	constructor(message?: string) {
		super(
			httpStatus.NOT_FOUND,
			message ?? "The requested resource was not found"
		);
	}
}
