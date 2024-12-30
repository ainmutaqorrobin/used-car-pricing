import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  @Post('/signup')
  createUser(@Body() body: CreateUserDTO) {
    const { email, password } = body;
    console.log(body);
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDTO) {
    const { email, password } = body;
    console.log(body);
  }
}
