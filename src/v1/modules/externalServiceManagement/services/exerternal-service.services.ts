import { injectable } from "tsyringe";
import { ProductService } from "@shared/external-services/products";
import { PaymentService } from "@shared/external-services/payments";
import { CustomerService } from "@shared/external-services/customers";
import { QuoteService } from "@shared/external-services/quotes";
import { ISingleProductRes, IProductsRes } from "@shared/external-services/products/products.types";
import { IGenerateQuoteResponse, IGetQuoteByIdRes, IGetQuotesRes } from "@shared/external-services/quotes/quotes.types";
import { GetQuoteDTO, GetQuotesDTO, OnboardCustomerDTO, PaymentLinkDTO, PremiumDTO, QuoteDTO, GetProductsDTO } from "../dtos/external-service.dto";
import ExternalServiceFactory from "../factories/external-service.factory";
import { IPaymentLinkRes } from "@shared/external-services/payments/payments.types";
import { IOnboardCustomerRes } from "@shared/external-services/customers/customers.types";
@injectable()
class ExternalService {
	constructor(
		private readonly productService: ProductService,
		private readonly paymentService: PaymentService,
		private readonly customerService: CustomerService,
		private readonly quoteService: QuoteService
	) {}

	async getProducts(dto: GetProductsDTO): Promise<IProductsRes[]> {
		return await this.productService.getProducts(dto);
	}

	async getSingleProduct(id: string, token: string): Promise<ISingleProductRes> {
		return await this.productService.getProductById(id, token);
	}

	async generatePremium(dto: PremiumDTO) {
		return ExternalServiceFactory.readPremiumValue(dto);
	}

	async generateQuote(dto: QuoteDTO): Promise<IGenerateQuoteResponse> {
		return await this.quoteService.generateQuote(dto);
	}

	async generatePaymentLink(dto: PaymentLinkDTO): Promise<IPaymentLinkRes> {
		return await this.paymentService.generatePaymentLink(dto);
	}

	async onboardCustomer(dto: OnboardCustomerDTO): Promise<IOnboardCustomerRes> {
		return await this.customerService.onboardCustomer(dto);
	}

	async getQuotes(dto: GetQuotesDTO): Promise<IGetQuotesRes[]> {
		return await this.quoteService.getQuotes(dto);
	}

	async getQuoteById(dto: GetQuoteDTO): Promise<IGetQuoteByIdRes> {
		return await this.quoteService.getQuoteById(dto);
	}

	async getQuoteHistoryById(dto: GetQuoteDTO): Promise<IGetQuoteByIdRes[]> {
		return await this.quoteService.getQuoteHistoryByID(dto);
	}
}

export default ExternalService;
