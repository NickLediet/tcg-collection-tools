import { Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from './error-response.interface';

export type ErrorResponseParams = {
    errorMessage: string,
    statusCode: HttpStatus,
    response: Response
}

export class BaseController {
    protected readonly logger: Logger
    constructor() {
        const constructorString: string = this.constructor.toString();
        const className: string = constructorString.match(/\w+/g)[1]; 
        this.logger = new Logger(className);
    }
    
    protected sendErrorResponse(
        { errorMessage, statusCode, response }: ErrorResponseParams, 
        log: boolean = true
    ): Response<ErrorResponse> {
        if(log) this.logger.error(errorMessage)

        return response
            .status(statusCode)
            .json({ 
                error: {
                    message: errorMessage
                }
            })
    }
}