import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  // it('throws error if user signup with existed email', async () => {
  //   fakeUsersService.find = () =>
  //     Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

  //   await expect(service.signup('test@gmail.com', 'test')).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });

  it('throws if signin with email does not exist', async () => {
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
});
