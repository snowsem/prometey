import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
class LogsMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction) {
        response.on('finish', () => {
            const { originalUrl } = request;
            const { ip, method, path: url } = request;
            const userAgent = request.get('user-agent') || '';
            const { statusCode, statusMessage } = response;
            const contentLength = response.get('content-length');

            const message = `${method} ${url} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${statusMessage}`


            if (statusCode >= 500) {
                return this.logger.error(message);
            }

            if (statusCode >= 400) {
                return this.logger.warn(message);
            }

            return this.logger.log(message);
        });

        next();
    }
}

export default LogsMiddleware;