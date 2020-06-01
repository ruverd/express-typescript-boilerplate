import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User | undefined> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const checkDuplicatedEmail = await this.usersRepository.findByEmail(email);

    if (checkDuplicatedEmail && user.email !== email) {
      throw new AppError('Duplicated Email');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('Old password required');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Wrong old password');
      }

      user.password = password;
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
