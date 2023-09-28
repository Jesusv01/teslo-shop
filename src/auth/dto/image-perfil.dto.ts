import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength, IsOptional } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateImagePerfilDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  user: User;
}
