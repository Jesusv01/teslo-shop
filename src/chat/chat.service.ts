import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { In, Not, Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { User } from 'src/auth/entities/user.entity';
import { RoomUser } from './entities/room-user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomUser)
    private readonly roomUserRepository: Repository<RoomUser>,
  ) {}
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const { roomId, userSendId } = createMessageDto;
      const user = await this.userRepository.findOne({
        where: { id: userSendId },
        select: { email: true, password: true, id: true, active: true },
      });
      if (!user) throw new NotFoundException('El usuario ingresado no existe');

      const room = await this.roomRepository.findOne({
        where: { id: roomId },
      });
      if (!room) throw new NotFoundException('La sala ingresada no existe');
      await this.messageRepository.save({
        userSend: user,
        room,
        message: createMessageDto.message,
      });
      return {
        message: 'created message successfully',
      };
    } catch (error) {
      return {
        error: error.response,
      };
    }
  }

  async findRooms(ids: number[], idUser: number) {
    try {
      const roomsUser = await this.roomUserRepository.find({
        where: { roomId: In(ids), userId: Not(idUser) },
        relations: {
          users: true,
        },
      });
      return roomsUser;
    } catch (error) {
      return {
        error: error.response,
      };
    }
  }

  async findMessages(idRoom: number) {
    try {
      const messages = await this.messageRepository.find({
        where: {
          room: {
            id: idRoom,
          },
        },
        relations: {
          userSend: true,
        },
      });
      return messages;
    } catch (error) {
      return {
        error: error.response,
      };
    }
  }

  async findRoomsUsers(idUsers: number[]) {
    try {
      const rooms = idUsers.map(async (idUser) => {
        const responseRoom = await this.roomRepository.find({
          where: { users: { id: idUser } },
        });
        return responseRoom;
      });
      const room = await Promise.all(rooms);
      const roomsUser = await this.roomUserRepository.find({
        where: { userId: In(idUsers) },
        relations: {
          users: true,
        },
      });
      return roomsUser;
    } catch (error) {
      return {
        error: error.response,
      };
    }
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
