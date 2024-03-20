export class ValidationError extends Error {
  details: any;
  static type = 'ValidationError';

  constructor(message: string, details: any = null) {
    super(message);
    this.details = details;
  }
}

export class NotFoundError extends Error {
  static type = 'NotFoundError';

  constructor(message: string) {
    super(message);
  }
}
