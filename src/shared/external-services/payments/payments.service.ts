import { AxiosInstance } from "axios";
import { IPaymentServiceActions } from "./payments.interface";
import { IPaymentLinkPayload, IPaymentLinkRes, IPaymentResponse } from "./payments.types";
import HTTPClient from "@shared/http-client/http-client";
import appConfig from "@config/app.config";
import logger from "@shared/utils/logger";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import httpStatus from "http-status";
import AppError from "@shared/error/app.error";

export class PaymentService implements IPaymentServiceActions {
	private static instance: PaymentService;
	private httpClient: AxiosInstance;

	private constructor() {
		this.httpClient = HTTPClient.create({
			baseURL: appConfig.finance.base_url
		});
	}

	async generatePaymentLink(payload: IPaymentLinkPayload): Promise<IPaymentLinkRes> {
		const url = `/payment-link`;
		const response = await this.httpClient
			.post<IPaymentResponse<IPaymentLinkRes>>(url, payload)
			.catch((e) => {
				return this.errorHandler(e, payload, "generatePaymentLink");
			});
		this.requestResponseLogger(payload, response, url);
		return response.data.data;
	}

	private errorHandler = (e: any, payload, action) => {
		const errorMessage =
			e?.message || "An unexpected error occurred. Please try again";
		if (e?.response?.status && e?.response?.data?.message) {
			logger.error(
				{ e, payload },
				`PaymentServicerviceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(e.response.status, e.response.data.message);
		} else {
			logger.error(
				{ e, payload },
				`PaymentServicerviceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(
				httpStatus.SERVICE_UNAVAILABLE,
				`Error: ${errorMessage}`
			);
		}
	};

	private requestResponseLogger = (
		request: ObjectLiteral | undefined,
		response: ObjectLiteral,
		url: string
	) => {
		logger.info({ request, response }, `PaymentService: ${url}`);
	};

	public static getInstance(): PaymentService {
		if (!PaymentService.instance) {
			PaymentService.instance = new PaymentService();
		}
		return PaymentService.instance;
	}
}