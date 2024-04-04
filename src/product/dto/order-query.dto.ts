import { IsIn, IsOptional } from 'class-validator';

export class OrderQueryDto {
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
