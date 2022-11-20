import { Injectable } from '@nestjs/common';
import { User } from './models/user';
import { CreateUserInput } from './dto/input/create-user.input';
import { v4 as uuid } from 'uuid';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUsersArgs } from './dto/args/get-users.args';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';

@Injectable()
export class UsersService {
  private users: User[] = [];

  createUser(createUserData: CreateUserInput): User {
    const user: User = {
      userId: uuid(),
      ...createUserData,
    };
    this.users.push(user);
    return user;
  }

  updateUser(updateUserData: UpdateUserInput): User {
    const user = this.users.find(
      (user) => user.userId === updateUserData.userId,
    );
    Object.assign(user, updateUserData);
    return user;
  }

  getUser(getUserArgs: GetUserArgs): User {
    const user = this.users.find((user) => user.userId === getUserArgs.userId);
    return user;
  }

  getUsers(getUsersArgs: GetUsersArgs): User[] {
    return getUsersArgs.userIds.map((userId) => this.getUser({ userId }));
  }

  deleteUser(deleteUser: DeleteUserInput): User {
    const userIndex = this.users.findIndex(
      (user) => user.userId === deleteUser.userId,
    );
    const user = this.users[userIndex];
    this.users.splice(userIndex);
    return user;
  }
}
