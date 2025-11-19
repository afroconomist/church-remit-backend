export interface IPaymentResponse<T>{
 status: boolean;
 message: string;
 data: T;
}

export interface IPaymentLinkPayload {
	email: string;
	amount: string;
}

export interface IPaymentLinkRes {
	checkoutLink: string;
	reference: string;
	accessCode: string;
}