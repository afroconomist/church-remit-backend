import { IGenerateQuotePayload, IGenerateQuoteResponse, IGetQuoteByIdPayload, IGetQuoteByIdRes, IGetQuotesPayload, IGetQuotesRes } from "./quotes.types";


export interface IQuoteServiceActions {
	generateQuote(payload: IGenerateQuotePayload): Promise<IGenerateQuoteResponse>;
	getQuotes(payload: IGetQuotesPayload): Promise<IGetQuotesRes[]>;
	getQuoteById(payload: IGetQuoteByIdPayload): Promise<IGetQuoteByIdRes>;
	getQuoteHistoryByID(payload: IGetQuoteByIdPayload): Promise<IGetQuoteByIdRes[]>;
}