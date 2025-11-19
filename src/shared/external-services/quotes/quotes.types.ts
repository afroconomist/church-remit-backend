export interface IQuoteResponse<T>{
 status: boolean;
 message: string;
 data: T;
}

interface ICovers {
	name: string;
	premium: number;
	premiumType: string;
	id?: string;
	quotationId?: string;
	createdA?: string;
	updatedAt?: string;
}

export interface IGenerateQuotePayload {
	sumInsured: number;
	productId: string;
	premiumRate: Float64Array;
	discountRate: number;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	notes: string;
	brokerId: string;
	relationshipManagerId: string;
	relationshipManagerName: string;
	relationshipManagerPhoneNumber: string;
	brokerName: string;
	brokerPhoneNumber: string;
	covers: ICovers[];
	premiumCalculationType: string;
	isMotorProduct: string;
	totalNoOfVehicles: number;
	accessToken?: string;
}

interface IQuote {
	id: string;
	productId: string;
	quotationNumber: string;
	type: string;
	sumInsured: string;
	premiumRate: string;
	discountRate: string;
	calculatedPremium: string;
	customerId: string;
	brokerId: string;
	relationshipManagerId: string;
	file: string;
	notes: string;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

interface IQuoteFile {
	id: string;
	quotationId: string;
	file: string;
	createdAt: string;
	updatedAt: string;
}

export interface IGenerateQuoteResponse {
	quote: IQuote;
	file: IQuoteFile;
	covers: ICovers[];
}

export interface IGetQuotesPayload {
	search: string;
	page: number;
	perPage: number;
	accessToken?: string;
}

export interface IGetQuotesRes {
	quotes: IQuote[];
	meta: {
		total: number;
		page: number;
		perPage: number;
		totalPages: number;
	};
}

export interface IGetQuoteByIdPayload {
	id: string;
	accessToken?: string;
}

export interface IGetQuoteByIdRes {
	quote: IQuote;
}