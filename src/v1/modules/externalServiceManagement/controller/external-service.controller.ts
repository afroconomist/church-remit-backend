import { Request, Response } from "express";
import { SuccessResponse } from "@shared/utils/response.util";
import { injectable } from "tsyringe";
import ExternalService from "../services/exerternal-service.services";
@injectable()
class ExternalServiceController {
  constructor(private readonly externalService: ExternalService) {}

  getProducts = async (req: Request, res: Response) => {
    const response = await this.externalService.getProducts({
      search: (req.query.search as string) || "",
      page: parseInt(req.query.page as string) || 1,
      perPage: parseInt(req.query.perPage as string) || 10,
      accessToken: (req as any).accessToken,
    });

    res.send(SuccessResponse("Operation successful", { response }));
  };

  getProductById = async (req: Request, res: Response) => {
    const response = await this.externalService.getSingleProduct(
      req.params.id,
      (req as any).accessToken
    );

    res.send(SuccessResponse("Operation successful", response));
  };

  generatePremium = async (req: Request, res: Response) => {
    const response = await this.externalService.generatePremium({
      sumInsured: req.body.sumInsured,
      premiumRate: req.body.premiumRate,
    });

    res.send(SuccessResponse("Operation successful", response));
  };

	generateQuote = async (req: Request, res: Response) => {
		const response = await this.externalService.generateQuote({
			sumInsured: req.body.sumInsured,
			productId: req.body.productId,
			premiumRate: req.body.premiumRate,
			discountRate: req.body.discountRate,
			customerName: req.body.customerName,
			customerPhone: req.body.customerPhone,
			customerEmail: req.body.customerEmail,
			notes: req.body.notes,
			brokerId: req.body.brokerId,
			relationshipManagerId: req.user.id,
			relationshipManagerName: `${req.user.name}`,
			relationshipManagerPhoneNumber: req.user.phoneNumber,
			brokerName: req.body.brokerName,
			brokerPhoneNumber: req.body.brokerPhoneNumber,
			covers: req.body.covers,
			isMotorProduct: req.body.isMotorProduct,
			premiumCalculationType: req.body.premiumCalculationType,
			totalNoOfVehicles: req.body.totalNoOfVehicles,
			accessToken: (req as any).accessToken,
		});
		res.send(SuccessResponse("Operation successful", response));
	};

  genratePaymentLink = async (req: Request, res: Response) => {
    const response = await this.externalService.generatePaymentLink({
      email: req.body.email,
      amount: req.body.amount,
    });

    res.send(SuccessResponse("Operation successful", response));
  };

	onboardCustomer = async (req: Request, res: Response) => {
		const response = await this.externalService.onboardCustomer({
			email: req.body.email,
			title: req.body.title,
			phoneNumber: req.body.phoneNumber,
			gender: req.body.gender,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			dateOfBirth: req.body.dateOfBirth,
			address: req.body.address,
			country: req.body.country,
			state: req.body.state,
			city: req.body.city,
			annualPersonalIncome: req.body.annualPersonalIncome,
			idType: req.body.idType,
			idExpiryDate: req.body.idExpiryDate,
			idNumber: req.body.idNumber,
			documents: req.body.documents,
			accessToken: (req as any).accessToken,
		});

    res.send(SuccessResponse("Operation successful", response));
  };

	getQuotes = async (req: Request, res: Response) => {
		const response = await this.externalService.getQuotes({
			search: (req.query.search as string) || "",
			page: parseInt(req.query.page as string) || 1,
			perPage: parseInt(req.query.perPage as string) || 10,
			accessToken: (req as any).accessToken,
		});

    res.send(SuccessResponse("Operation successful", response));
  };

  getQuoteById = async (req: Request, res: Response) => {
    const response = await this.externalService.getQuoteById({
      id: req.params.id,
      accessToken: (req as any).accessToken,
    });

    res.send(SuccessResponse("Operation successful", response));
  };

  getQuoteHistoryById = async (req: Request, res: Response) => {
    const response = await this.externalService.getQuoteHistoryById({
      id: req.params.id,
      accessToken: (req as any).accessToken,
    });

		res.send(SuccessResponse("Operation successful", response));
	}
}

export default ExternalServiceController;
