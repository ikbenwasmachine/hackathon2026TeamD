import { IsArray, IsNumber } from 'class-validator';
import type { QuizSubmissionRequestDto } from 'shared-types';

export class SubmitQuizDto implements QuizSubmissionRequestDto {
    @IsArray()
    @IsNumber({}, { each: true })
    answers!: number[];
}
