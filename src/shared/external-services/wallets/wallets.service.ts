import { AxiosInstance } from "axios";
import HTTPClient from "@shared/http-client/http-client";
import appConfig from "@config/app.config";
import logger from "@shared/utils/logger";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import httpStatus from "http-status";
import AppError from "@shared/error/app.error";
import { IResolveAccountNumberResponse, ResolveAccountNumber, TransferDetails } from "./wallets.interface";
import WalletRepository from "../../../v1/modules/walletService/repositories/wallet.repository";

export class ExternalWalletService {
	private static instance: ExternalWalletService;
	private httpClient: AxiosInstance;

	private constructor() {
		this.httpClient = HTTPClient.create({
			baseURL: appConfig.finance.base_url,
			headers: {
				"x-secret-key": appConfig.api_gateway.secret_key,
			},
		});
	}

	async createWallet(payload: { accountName: string, autoPayoutEnabled: boolean }) {
		const url = `/payments/virtual-accounts`;
		const response = await this.httpClient
			.post(url, payload)
			.catch((e) => {
				return this.errorHandler(e, payload, "processTransfer");
			});
		this.requestResponseLogger(payload, response, url);
		return response.data;
	  }

	  async getWallet(userId: string) {
		const walletRepository = new WalletRepository();
		const wallet = await walletRepository.findOneWhere({ userId });
		const url = `/payments/virtual-accounts/${wallet?.accountNumber}`;
		const response = await this.httpClient
			.get(url)
			.catch((e) => {
				return this.errorHandler(e, {}, "getAllBanks");
			});
		this.requestResponseLogger({}, response, url);
		if (response.data.status) {
			return {
			  accountNumber: response.data.data.accountNumber,
			  status: response.data.data.status,
			  accountName: response.data.data.accountName,
			  autoPayoutEnabled: response.data.data.autoPayoutEnabled,
			};
		  }
		  return {
			accountNumber: "",
			status: "",
			accountName: "",
			autoPayoutEnabled: "",
		  };
	  }

	public async getAllBanks() {
		const url = `/payments/banks`;
		const response = await this.httpClient
			.get(url)
			.catch((e) => {
				return this.errorHandler(e, {}, "getAllBanks");
			});
		this.requestResponseLogger({}, response, url);
		return response.data.data;
	}

	async processTransfer(payload: TransferDetails) {
		const url = `/payments/transfer`;
		const response = await this.httpClient
			.post(url, payload)
			.catch((e) => {
				return this.errorHandler(e, payload, "processTransfer");
			});
		this.requestResponseLogger(payload, response, url);
		return response.data.data;
	}

	public async resolveAccountNumber(payload: ResolveAccountNumber): Promise<IResolveAccountNumberResponse> {
		const url = `/v1/payments/name-enquiry`;
		const response = await this.httpClient
			.post(url, payload)
			.catch((e) => {
				return this.errorHandler(e, payload, "resolveAccountNumber");
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
				`WalletServicerviceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(e.response.status, e.response.data.message);
		} else {
			logger.error(
				{ e, payload },
				`WalletServicerviceErrorHandler[${action}]: ${errorMessage}`
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
		logger.info({ request, response }, `WalletService: ${url}`);
	};

	public static getInstance(): ExternalWalletService {
		if (!ExternalWalletService.instance) {
			ExternalWalletService.instance = new ExternalWalletService();
		}
		return ExternalWalletService.instance;
	}
}