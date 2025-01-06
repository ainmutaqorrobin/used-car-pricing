import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDTO) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDTO) {
    return this.authService.signin(body.email, body.password);
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.usersService.update(+id, body);
  }
}
