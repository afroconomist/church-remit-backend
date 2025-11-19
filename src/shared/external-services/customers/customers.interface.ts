import { IOnboardCustomerRes, IOnboardCustomerPayload } from "./customers.types";


export interface ICustomerServiceActions {
	onboardCustomer(payload: IOnboardCustomerPayload): Promise<IOnboardCustomerRes>;
}