
import { getEnv } from "./env.config";

const appConfig = {
	app: {
		name: process.env.APP_NAME,
		brand: process.env.BRAND_NAME,
		base_url: String(process.env.APP_BASE_URL),
		env: getEnv(),
	},
	server: {
		port: Number(process.env.PORT),
	},
	redis: {
		host: String(process.env.REDIS_HOST),
		port: Number(process.env.REDIS_PORT),
		password: String(process.env.REDIS_PASSWORD),
	},
	database: {
		DB_CLIENT: process.env.DB_CLIENT,
		DB_URL: String(process.env.DB_URL),
	},
	coreBusinessApplication: {
		generalInsurance: {
			base_url: String(process.env.GENERAL_INSURANCE_SERVICE_URL),
		},
	},
	finance: {
		base_url: String(process.env.FINANCE_SERVICE_URL),
	},
	customer: {
		base_url: String(process.env.CUSTOMER_SERVICE_URL),
	},
	quotation: {
		base_url: String(process.env.QUOTATIONS_SERVICE_URL),
	},
	generalApiGateway: {
		base_url: String(process.env.API_GATEWAY_URL),
	},
	api_gateway: {
		base_url: String(process.env.API_GATEWAY_URL),
		secret_key: String(process.env.API_GATEWAY_SECRET_KEY),
	},
	obs_credential: {
		access_key_id: process.env.OBS_ACCESS_KEY_ID,
  		secret_access_key: process.env.OBS_SECRET_ACCESS_KEY,
  		server: process.env.OBS_SERVER_URL,
		bucket_name: process.env.OBS_BUCKET_NAME
	},
	max_concurrent_uploads: Number(process.env.MAX_CONCURRENT_UPLOADS),
	jwt_token: {
	  secret: String(process.env.JWT_SECRET),
	  session: String(process.env.SESSION),
	  refresh_token_session: String(process.env.REFRESH_TOKEN_SESSION)
	}
	
};

export default appConfig;
