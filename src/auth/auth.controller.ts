import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseFilters,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { HttpErrorFilter } from 'src/middleware/http-exception.filter';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateImagePerfilDto } from './dto/image-perfil.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseFilters(new HttpErrorFilter())
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @UseFilters(new HttpErrorFilter())
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Query() paginationDTO: PaginationDto) {
    return this.authService.findAll(paginationDTO);
  }

  @Post('perfil/image')
  @UseGuards(AuthGuard())
  @UseFilters(new HttpErrorFilter())
  perfilImage(
    @GetUser() user: User,
    @Body() createImagePerfilDto: CreateImagePerfilDto,
  ) {
    createImagePerfilDto.user = user;
    return this.authService.imagePerfil(createImagePerfilDto);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard())
  findOneUser(@Param('id') id: number) {
    return this.authService.findOneUser(+id);
  }

  @Get('user')
  @UseGuards(AuthGuard())
  findUser(@GetUser() user: User) {
    return user;
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user: user['email'],
      rawHeaders,
    };
  }
}
