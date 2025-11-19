import { AxiosInstance } from "axios";
import { ICustomerServiceActions } from "./customers.interface";
import { ICustomerResponse, IOnboardCustomerPayload, IOnboardCustomerRes } from "./customers.types";
import HTTPClient from "@shared/http-client/http-client";
import appConfig from "@config/app.config";
import logger from "@shared/utils/logger";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import httpStatus from "http-status";
import AppError from "@shared/error/app.error";

export class CustomerService implements ICustomerServiceActions {
	private static instance: CustomerService;
	private httpClient: AxiosInstance;
	private url: string;

	private constructor() {
		this.httpClient = HTTPClient.create({
			baseURL: appConfig.api_gateway.base_url,
			headers: {
				"x-secret-key": appConfig.api_gateway.secret_key,
			},
		});
		this.url = "/general/customer/onboard";
	}

	async onboardCustomer(
		payload: IOnboardCustomerPayload
	): Promise<IOnboardCustomerRes> {
		const { accessToken, ...requestBody } = payload;
		const path = `${this.url}/individual`;
		const response = await this.httpClient
			.post<ICustomerResponse<IOnboardCustomerRes>>(path, requestBody, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.catch((e) => {
				return this.errorHandler(e, requestBody, "onboardCustomer");
			});
		this.requestResponseLogger(requestBody, response, path);
		return response.data.data;
	}

	private errorHandler = (e: any, payload, action) => {
		const errorMessage =
			e?.message || "An unexpected error occurred. Please try again";
		if (e?.response?.status && e?.response?.data?.message) {
			logger.error(
				{ e, payload },
				`CustomerServicerviceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(e.response.status, e.response.data.message, e.response.data.errors);
		} else {
			logger.error(
				{ e, payload },
				`CustomerServicerviceErrorHandler[${action}]: ${errorMessage}`
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
		logger.info({ request, response }, `CustomerService: ${url}`);
	};

	public static getInstance(): CustomerService {
		if (!CustomerService.instance) {
			CustomerService.instance = new CustomerService();
		}
		return CustomerService.instance;
	}
}