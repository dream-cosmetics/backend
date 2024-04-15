import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

morgan.token('req-body', (req: Request) => {
  const body = JSON.stringify(req.body);
  return body === '{}' ? '' : body;
});

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private logger = morgan(':method :url :status - :response-time ms :req-body');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger(req, res, next);
  }
}
