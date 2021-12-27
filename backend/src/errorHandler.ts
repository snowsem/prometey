import { HttpError } from 'http-errors';
import { NextFunction, Request, Response } from 'express';

function errorsMiddleware(err: HttpError, req: Request, res: Response, next: NextFunction): void {
  const error = {
    status: err.status || 500,
    title: err.message || err.name || 'Unknown error',
  };

  res.status(error.status);
  res.json({
    errors: [error],
  });
}

export default errorsMiddleware;
