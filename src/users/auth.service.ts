import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';

const hash = promisify(scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new ConflictException('This email is already exist');
    }

    //generate a salt
    const salt = randomBytes(8).toString('hex');
    const hashedResult = (await hash(password, salt, 32)) as Buffer;

    //combine salt with hased result
    const combinedHashedSalt = salt + '.' + hashedResult.toString('hex');

    const user = await this.usersService.create(email, combinedHashedSalt);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('This email is not exist');
    }

    const [salt, storedPassword] = user.password.split('.');

    const hashedPassword = (
      (await hash(password, salt, 32)) as Buffer
    ).toString('hex');

    if (storedPassword !== hashedPassword) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
