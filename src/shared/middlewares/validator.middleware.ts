import Validator from "validatorjs";
import { ErrorResponse } from "../utils/response.util";
import { ObjectLiteral } from "../types/object-literal.type";
import { Request, Response } from "express";

type Error = {
  field: string;
  message: string;
};

export const validate = (rules: ObjectLiteral, validationMessages?: ObjectLiteral) => {
	return (request: Request, reply: Response, done) => {
		const source = { ...request.body, ...request.query, ...request.params };
		const validation = new Validator(source, rules, validationMessages);
		const errors = validation.errors.all();

		if (validation.fails()) {
			return reply
				.status(400)
				.send(
					ErrorResponse("Your data is invalid", createValidationError(errors))
				);
		}

		done();
	};
};

export const validateArray = (rulesArray: Array<ObjectLiteral>, validationMessages?: ObjectLiteral) => {
  return (request: Request, reply: Response, done: Function) => {
    const requestData = request.body || request.query;

    if (!Array.isArray(requestData)) {
      return reply.status(400).send(ErrorResponse("Payload should be an array", []));
    }

    
    let validationFailed = false;
    let allErrors: any = [];

    requestData.forEach((data: any, index: number) => {
      const validation = new Validator(data, rulesArray[0], validationMessages); 
      const errors = validation.errors.all();

      if (validation.fails()) {
        validationFailed = true;
        const formattedErrors = Object.keys(errors).map((field) => ({
          field: `Item ${index} - ${field}`, 
          messages: errors[field],
        }));
        allErrors.push(...formattedErrors);
      }
    });

    if (validationFailed) {
      return reply.status(400).send(ErrorResponse("Your data is invalid", allErrors));
    }
    done();
  };
};



export const createValidationError = (validationError: []) => {
  const errors: Error[] = [];

  for (const [key, value] of Object.entries(validationError)) {
    errors.push({
      field: key,
      message: value[0],
    });
  }

  return errors;
};