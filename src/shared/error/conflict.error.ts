import httpStatus from "http-status";
import AppError from "./app.error";

export default class ConflictError extends AppError {
	constructor(message?: string) {
		super(
			httpStatus.CONFLICT,
			message ?? "The request could not be completed due to a conflict with the current state of the target resource"
		);
	}
}
