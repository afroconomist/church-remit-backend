import { AxiosInstance } from "axios";
import { IQuoteServiceActions } from "./quotes.interface";
import { IGenerateQuotePayload, IGenerateQuoteResponse, IGetQuoteByIdPayload, IGetQuoteByIdRes, IGetQuotesPayload, IGetQuotesRes, IQuoteResponse } from "./quotes.types";
import HTTPClient from "@shared/http-client/http-client";
import appConfig from "@config/app.config";
import logger from "@shared/utils/logger";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import httpStatus from "http-status";
import AppError from "@shared/error/app.error";

export class QuoteService implements IQuoteServiceActions {
	private static instance: QuoteService;
	private httpClient: AxiosInstance;
	private url: string;

	private constructor() {
		this.httpClient = HTTPClient.create({
			baseURL: appConfig.api_gateway.base_url,
			headers: {
				"x-secret-key": appConfig.api_gateway.secret_key,
			},
		});
		this.url = "/general/quotations";
	}

	async generateQuote(
		payload: IGenerateQuotePayload
	): Promise<IGenerateQuoteResponse> {
		const { accessToken, ...requestBody } = payload;
		const path = `${this.url}`;
		const response = await this.httpClient
			.post<IQuoteResponse<IGenerateQuoteResponse>>(path, requestBody, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.catch((e) => {
				return this.errorHandler(e, requestBody, "generateQuote");
			});
		this.requestResponseLogger(requestBody, response, path);
		return response.data.data;
	}

	async getQuotes(payload: IGetQuotesPayload): Promise<IGetQuotesRes[]> {
		const { accessToken, ...requestBody } = payload;
		const path = `${this.url}/?search${requestBody.search}&page=${requestBody.page}&perPage=${requestBody.perPage}`;
		const response = await this.httpClient
			.get<IQuoteResponse<IGetQuotesRes[]>>(path, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.catch((e) => {
				return this.errorHandler(e, requestBody, "getQuotes");
			});
		this.requestResponseLogger(requestBody, response, path);
		return response.data.data;
	}

	async getQuoteById(payload: IGetQuoteByIdPayload): Promise<IGetQuoteByIdRes> {
		const { accessToken, ...requestBody } = payload;
		const path = `${this.url}/${requestBody.id}`;
		const response = await this.httpClient
			.get<IQuoteResponse<IGetQuoteByIdRes>>(path, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.catch((e) => {
				return this.errorHandler(e, requestBody, "getQuoteById");
			});
		this.requestResponseLogger(requestBody, response, path);
		return response.data.data;
	}

	async getQuoteHistoryByID(
		payload: IGetQuoteByIdPayload
	): Promise<IGetQuoteByIdRes[]> {
		const { accessToken, ...requestBody } = payload;
		const path = `${this.url}/${payload.id}/history`;
		const response = await this.httpClient
			.get<IQuoteResponse<IGetQuoteByIdRes[]>>(path, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.catch((e) => {
				return this.errorHandler(e, requestBody, "getQuoteHistoryByID");
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
				`QuoteServiceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(e.response.status, e.response.data.message);
		} else {
			logger.error(
				{ e, payload },
				`QuoteServiceErrorHandler[${action}]: ${errorMessage}`
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
		logger.info({ request, response }, `QuoteService: ${url}`);
	};

	public static getInstance(): QuoteService {
		if (!QuoteService.instance) {
			QuoteService.instance = new QuoteService();
		}
		return QuoteService.instance;
	}
}