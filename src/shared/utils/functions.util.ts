import crypto from "crypto";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createObjectCsvStringifier } from 'csv-writer';
import appConfig from "@config/app.config";

dotenv.config();
export const GetRandomID = (maxLength: number = 30): string => {
  const id = `${uuid()}`;
  const cleaned = id.replaceAll("-", `${Math.floor(Math.random() * 100)}`);

  return cleaned.substring(0, maxLength);
};

export const GetUUID = (): string => uuid();

export const createSha512Hash = (data: any, key: string) => {
  const hash = crypto.createHmac("sha512", key).update(JSON.stringify(data)).digest("hex");

  return hash;
};

export const convertKeysToCamelCase = (obj: Object) => {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Return as is for non-object values
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  }

  const camelCasedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key[0].toLowerCase() + key.slice(1); // Convert the first character to lowercase
      camelCasedObj[camelKey] = convertKeysToCamelCase(obj[key]);
    }
  }
  return camelCasedObj;
};

export const formatAmountForDisplay = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: currency }).format(amount);
};

export function generateCode(length: number) {
  var result = "";
  var characters = "123456789123456789123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export function generateDummyAccountNumber(): string {
  const prefix = "02";
  const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  return prefix + randomDigits;
}

export const generateToken = async () => {
  return crypto.randomBytes(20).toString("hex");
};

export const generateJwtToken = async (user: any) => {
  const secret_key: any = appConfig.jwt_token.secret;
  const session = appConfig.jwt_token.session;
  const token = jwt.sign(
		{
			user: {
				id: user.id,
				accessGroup: user.role,
				email: user.email,
				name: `${user.firstName} ${user.lastName}`,
				phoneNumber: user.phoneNumber,
			},
		},
		secret_key,
		{ expiresIn: session }
	);
  return token;
};

export const generateRefreshToken = async (user: any) => {
  const secret_key: any = appConfig.jwt_token.secret;
  const session = appConfig.jwt_token.refresh_token_session;
  const token = jwt.sign(
		{
			user: {
				id: user.id,
				accessGroup: user.role,
				email: user.email,
				name: `${user.firstName} ${user.lastName}`,
				phoneNumber: user.phoneNumber,
			},
		},
		secret_key,
		{ expiresIn: session }
	);
  return token;
};

export async function exportCSVData(headers: any, data: any) {
  const csvStringifier = createObjectCsvStringifier({
    header: headers,
  });

  const csvHeader = csvStringifier.getHeaderString();
  const csvRecords = csvStringifier.stringifyRecords(data);

  return csvHeader + csvRecords; // Combine header and records
}

export const getAgeByDate = (dateString: string) => {

  const dob = new Date(dateString);
  const currentDate = new Date();
  const birthYear = dob.getFullYear();
  const currentYear = currentDate.getFullYear();
  const age = currentYear - birthYear;
  return age;
};

export const getBirthYear = (dateString: string) => {
  const dob = new Date(dateString);
  return dob.getFullYear();
};

export function validateEmail(input_str: string) {
  var re = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(input_str);
}

export function stringToSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function format_number(number: number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(number);
}

export function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export const generateTransactionReference = async (): Promise<string> => {
  const timestamp = Date.now().toString().padStart(16, "0");
  const randomDigits = crypto.randomBytes(8).toString("hex").padStart(16, "0");
  const transactionReference = timestamp + randomDigits;
  return transactionReference;
};
