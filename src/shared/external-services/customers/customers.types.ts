export interface ICustomerResponse<T>{
 status: boolean;
 message: string;
 data: T;
}

export interface IOnboardCustomerPayload {
	email: string;
	title: string;
	phoneNumber: string;
	gender: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	address: string;
	country: string;
	state: string;
	city: string;
	annualPersonalIncome: number;
	idType: string;
	idExpiryDate: string;
	idNumber: string;
	documents?: string[];
	accessToken?: string;
}

interface IKyc {
	id: string;
	userId: string;
	idType: string;
	idNumber: string;
	verificationStatus: string;
	firstName: string;
	lastName: string;
	middleName: string | null;
	dateOfBirth: string;
	city: string;
	country: string;
	state: string;
	lga: string | null;
	address: string;
	url: string | null;
	idExpiryDate: string | null;
	createdAt: string;
	updatedAt: string;
}

interface IIndividual {
	id: string;
	email: string;
	phoneNumber: string;
	gender: string;
	title: string;
	firstName: string;
	middleName: string | null;
	lastName: string;
	dateOfBirth: string;
	kycStatus: string;
	address: string;
	country: string;
	state: string;
	status: string;
	annualPersonalIncome: string;
	customerType: string;
	createdAt: string;
	updatedAt: string;
}

interface IDocument {
	id: string;
	idType: string;
	title: string;
	customerId: string;
	url: string;
	createdAt: string;
	updatedAt: string;
	deleted_at: string | null;
}

export interface IOnboardCustomerRes {
	kyc: IKyc;
	individual: IIndividual;
	documents: IDocument[];
}