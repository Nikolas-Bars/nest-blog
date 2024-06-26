import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// https://docs.nestjs.com/exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        console.log(1, responseBody.message);
        responseBody.message.forEach((e) =>
            // @ts-ignore
          errorsResponse.errorsMessages.push(e),
        );
      } else {
        console.log(2, responseBody.message);
        // @ts-ignore
        errorsResponse.errorsMessages.push(responseBody.message);
      }
      response.status(status).send(errorsResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
