import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { RoomUser } from './entities/room-user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Message, Room, RoomUser]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [ChatService, TypeOrmModule],
})
export class ChatModule {}
