import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { validate } from "@shared/middlewares/validator.middleware";
import authMiddleware from "@shared/middlewares/auth.middleware";
import ExternalServiceController from "../controller/external-service.controller";
import {
	generatePaymentLinkRules,
	generatePremiumRules,
	generateQuoteRules,
	getSingleProductRules,
	onboardCustomerRules,
	getSingleQuoteRules,
	getQuotesRules,
	getProductsRules,
} from "../validations/external-service.validator";
import accessControlMiddleware from "@shared/middlewares/access-control.middleware";
import { AccessControls } from "../../accessControlManagement/enums/access-control.enum";
const externalServiceController = container.resolve(ExternalServiceController);
const router = express.Router();

router.get(
	"/external-services/products",
	[validate(getProductsRules), authMiddleware, accessControlMiddleware(AccessControls.PRODUCT_LIST)],
	(req: Request, res: Response, next) => {
		externalServiceController.getProducts(req, res).catch((e) => next(e));
	}
);


router.get(
	"/external-services/products/:id",
	[validate(getSingleProductRules), authMiddleware, accessControlMiddleware(AccessControls.PRODUCT_LIST)],
	(req: Request, res: Response, next) => {
		externalServiceController.getProductById(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/products/generate-premium",
	[validate(generatePremiumRules), authMiddleware],
	(req: Request, res: Response, next) => {
		externalServiceController.generatePremium(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/products/generate-payment-link",
	[validate(generatePaymentLinkRules), authMiddleware],
	(req: Request, res: Response, next) => {
		externalServiceController.genratePaymentLink(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/products/onboard-customer",
	[validate(onboardCustomerRules), authMiddleware, accessControlMiddleware(AccessControls.USER_ONBOARDING)],
	(req: Request, res: Response, next) => {
		externalServiceController.onboardCustomer(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/quotes/generate-quote",
	[validate(generateQuoteRules), authMiddleware, accessControlMiddleware(AccessControls.QUOTE_CREATION)],
	(req: Request, res: Response, next) => {
		externalServiceController.generateQuote(req, res).catch((e) => next(e));
	}
);

router.get(
	"/external-services/quotes",
	[validate(getQuotesRules), authMiddleware, accessControlMiddleware(AccessControls.QUOTE_LIST)],
	(req: Request, res: Response, next) => {
		externalServiceController.getQuotes(req, res).catch((e) => next(e));
	}
);

router.get(
	"/external-services/quotes/:id",
	[validate(getSingleQuoteRules), authMiddleware, accessControlMiddleware(AccessControls.QUOTE_LIST)],
	(req: Request, res: Response, next) => {
		externalServiceController.getQuoteById(req, res).catch((e) => next(e));
	}
);

router.get(
	"/external-services/quotes/:id/history",
	[validate(getSingleQuoteRules), authMiddleware, accessControlMiddleware(AccessControls.QUOTE_LIST)],
	(req: Request, res: Response, next) => {
		externalServiceController.getQuoteHistoryById(req, res).catch((e) => next(e));
	}
);

export default router;
