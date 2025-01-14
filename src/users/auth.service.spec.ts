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
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'test@gmail.com', password: 'test' } as User,
      ]);

    await expect(service.signup('test@gmail.com', 'test')).rejects.toThrow(
      ConflictException,
    );
  });

  it('throws if signin with email does not exist', async () => {
    fakeUsersService.find = () => Promise.resolve([]);

    await expect(
      service.signin('asdasdasdasd@gmail.com', 'test'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if user entered invalid password', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'ain@gmail.com', password: '123' } as User]);

    await expect(service.signin('ain@gmail.com', 'passowrd')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'ain@gmail.com',
          //encrypted password
          password:
            'a6cef35946e23372.fe17a8ca945b250bbea6f2472527c9b7632b93cc05aa88016a03e8175f3af7a8',
        } as User,
      ]);
    const user = await service.signin('ain@gmail.com', '123');
    expect(user).toBeDefined();
  });
});
