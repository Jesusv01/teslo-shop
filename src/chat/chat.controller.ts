import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { identity } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Post('messages')
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.createMessage(createMessageDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Get('messages/room/:id')
  findMessage(@Param('id') id: string) {
    return this.chatService.findMessages(+id);
  }

  @Get('rooms/search')
  @UseGuards(AuthGuard())
  findRooms(@GetUser('id') idUser: number, @Query('ids') ids: string[]) {
    let idArray = null;
    if (ids) {
      idArray = ids.map((id) => parseInt(id, 10));
    }
    return this.chatService.findRooms(idArray, idUser);
  }

  @Get('rooms/user')
  @UseGuards(AuthGuard())
  findRoomsUsers(@GetUser() user: User, @Query('idUsers') idUsers: string[]) {
    let idArray = null;
    if (idUsers) {
      idArray = idUsers.map((id) => parseInt(id, 10));
    }
    return this.chatService.findRoomsUsers(idArray);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
