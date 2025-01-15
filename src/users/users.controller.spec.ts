import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@gmail.com',
          password: 'test',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'test' } as User]);
      },
      // remove: (id: number) => {},
      // update: (id: number, body: UpdateUserDTO) => {},
    };
    fakeAuthService = {
      // signin: () => {},
      // signup: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return a list of users with entered email', async () => {
    const users = await controller.findAllUsers('test@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@gmail.com');
  });

  it('findUser will return single user with entered id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('findUser throws not found exception if given id is not found', async () => {
    fakeUsersService.findOne = (id) => Promise.reject(new NotFoundException());
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
});
