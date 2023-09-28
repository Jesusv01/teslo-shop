import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Console } from 'console';
import { CreateImagePerfilDto } from './dto/image-perfil.dto';
import { UserImage } from './entities/user-image.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserImage)
    private readonly userImageRepository: Repository<UserImage>,

    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    // try {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        active: true,
      },
    });
    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      // ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async imagePerfil(createImagePerfilDto: CreateImagePerfilDto) {
    try {
      await this.userImageRepository.upsert([createImagePerfilDto], ['user']);
      // await this.userImageRepository.save(userImage);
      return {
        message: 'created successfully',
      };
    } catch (error) {
      console.log(error);
      this.handleDBExceptons(error);
    }
  }

  async findOneUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findAll(paginationDTO: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDTO;
    const products = await this.userRepository.find({
      take: limit,
      skip: offset,
    });
    return products;
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check server logs');
  }

  private handleDBExceptons(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
