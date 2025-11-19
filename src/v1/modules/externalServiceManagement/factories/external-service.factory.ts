import { ObjectLiteral } from "@shared/types/object-literal.type";
import { PremiumDTO } from "../dtos/external-service.dto";

class ExternalServiceFactory {
	static readPremiumValue(data: PremiumDTO) {
		const premium = {} as ObjectLiteral;

    premium.sumInsured = data.sumInsured;
    premium.premiumRate = data.premiumRate;
    premium.value = premium.sumInsured * premium.premiumRate;
    return premium;
	}
}

export default ExternalServiceFactory;
