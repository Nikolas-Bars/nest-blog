import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform,} from '@nestjs/common';

// Custom pipe
// https://docs.nestjs.com/pipes#custom-pipes
@Injectable()
export class NumberPipe implements PipeTransform {

    private readonly withThrowError: boolean;

    constructor(options: { withThrowError: boolean }) {
        this.withThrowError = options.withThrowError;
    };

    transform(value: any, metadata: ArgumentMetadata) {
        const num = Number(value);

        if (isNaN(num) && this.withThrowError) {
            throw new BadRequestException('Not a number');
        }

        return this.withThrowError ? num : value;
    }
}