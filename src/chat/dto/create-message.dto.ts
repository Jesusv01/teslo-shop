import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../entities/message.entity';
import {
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  message: string;

  @ApiProperty()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsNumber()
  userSendId: number;
}
