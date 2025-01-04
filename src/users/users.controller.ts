import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDTO) {
    this.usersService.create(body.email, body.password);
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDTO) {
    const { email, password } = body;
    console.log(body);
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
}
