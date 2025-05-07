import { PartialType } from '@nestjs/swagger';
import { CreateUserStudyDto } from './create-user-study.dto';

export class UpdateUserStudyDto extends PartialType(CreateUserStudyDto) {}
