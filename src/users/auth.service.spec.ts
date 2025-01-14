import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('AuthService testing using fake service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    //Create fake copy of users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create new user with salted and hashed password', async () => {
    const user = await service.signup('testuser@gmail.com', 'test');

    expect(user.password).not.toEqual('test');
    const [salt, hashedPassword] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hashedPassword).toBeDefined();
  });

  it('throws error if user signup with existed email', async () => {
    await service.signup('test@gmail.com', 'test');

    await expect(service.signup('test@gmail.com', 'test')).rejects.toThrow(
      ConflictException,
    );
  });

  it('throws if signin with email does not exist', async () => {
    await expect(
      service.signin('asdasdasdasd@gmail.com', 'test'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if user entered invalid password', async () => {
    await service.signup('ain@gmail.com', 'password');

    await expect(service.signin('ain@gmail.com', 'passowrd')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('ain@gmail.com', '123');
    const user = await service.signin('ain@gmail.com', '123');
    expect(user).toBeDefined();
  });
});
