export const getSingleProductRules = {
	id: "required|uuid",
};

export const generatePremiumRules = {
  sumInsured: "required|numeric",
  premiumRate: "required|numeric",
};

export const generateQuoteRules = {
	sumInsured: "required|numeric",
	productId: "required|uuid",
	premiumRate: "required|numeric",
	discountRate: "numeric",
	customerName: "required|string",
	customerEmail: "required|email",
	customerPhone: "required|string",
	notes: "string",
	brokerId: "uuid",
	brokerName: "string",
	brokerPhoneNumber: "string",
	covers: "array",
	totalNoOfVehicles: "numeric",
	isMotorProduct: "boolean",
	premiumCalculationType: "string"
};

export const generatePaymentLinkRules = {
  email: "required|email",
  amount: "required|string",
};

export const onboardCustomerRules = {
	email: "required|email",
	title: "required|string",
	phoneNumber: "required|string",
	gender: "required|string",
	firstName: "required|string",
	lastName: "required|string",
	dateOfBirth: "required|date",
	address: "required|string",
	country: "required|string",
	state: "required|string",
	city: "required|string",
	annualPersonalIncome: "required|numeric",
	idType: "required|string",
	idExpiryDate: "required|date",
	idNumber: "required|string",
	documents: "array",
};

export const getSingleQuoteRules = getSingleProductRules;

export const getQuotesRules = {
	search: "string",
	page: "numeric",
	perPage: "numeric",
};

export const getSingleQuoteHistoryRules = getSingleQuoteRules;

export const getProductsRules = {
	search: "string",
	page: "numeric",
	perPage: "numeric",
};

