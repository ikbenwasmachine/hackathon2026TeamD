import { IsBoolean } from 'class-validator';

export class ToggleLessonDto {
  @IsBoolean()
  completed!: boolean;
}
