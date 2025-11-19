import { IPaymentLinkRes, IPaymentLinkPayload } from "./payments.types";


export interface IPaymentServiceActions {
	generatePaymentLink(payload: IPaymentLinkPayload): Promise<IPaymentLinkRes>;
}