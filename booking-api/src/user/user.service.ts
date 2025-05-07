import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/PrismaService/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const result = await this.prisma.user.create({ data })
    return result
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const result = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return result
  }


  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const result = await this.prisma.user.findUnique({ where })
    return result
  }

  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User> {
    const result = await this.prisma.user.update({ where, data })
    return result
  }

  async remove(data: Prisma.UserWhereUniqueInput): Promise<User> {
    const { id } = data
    const check = await this.prisma.user.findUnique({ where: { id } })
    if (!check) throw new NotFoundException()
    const result = await this.prisma.user.delete({ where: { id } })
    if (!result) throw new BadRequestException()
    return result
  }
}
