import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });
    const exist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (exist)
      throw new NotFoundException('El email ingresado ya esta registrado');
    await this.userRepository.save(user);
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
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
}
