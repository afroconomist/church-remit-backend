export class InvalidRequestError extends Error {
    public readonly statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.name = "InvalidRequestError";
      this.statusCode = 400;
      Object.setPrototypeOf(this, InvalidRequestError.prototype);
    }
  }