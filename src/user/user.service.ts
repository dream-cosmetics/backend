import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { genSalt, hash, compare } from 'bcryptjs';
import { userSelect } from './constants/user.select';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await this.hashPassword(createUserDto.password),
        },
        select: userSelect,
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or phone already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: userSelect,
    });
  }

  async findOneOrThrowError(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) {
      throw new BadRequestException(`User with id:${id} not found`);
    }
    return user;
  }

  async findByEmailOrThrowError(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(`User with email:${email} not found`);
    }
    return user;
  }

  async findOne(id: number) {
    return await this.findOneOrThrowError(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneOrThrowError(id);
    return this.prismaService.user.update({
      where: { id: user.id },
      data: updateUserDto,
      select: userSelect,
    });
  }

  async remove(id: number) {
    const user = await this.findOneOrThrowError(id);
    return this.prismaService.user.delete({
      where: { id: user.id },
      select: userSelect,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmailOrThrowError(email);
    if (user && (await compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('Invalid credentials');
  }

  async hashPassword(password: string) {
    const salt = await genSalt();
    return hash(password, salt);
  }
}
