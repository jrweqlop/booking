import { Injectable } from '@nestjs/common';
import { Prisma, UserStudy } from '@prisma/client';
import { PrismaService } from 'src/PrismaService/prisma.service';

@Injectable()
export class UserStudyService {

  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.UserStudyCreateInput): Promise<UserStudy> {
    const result = await this.prisma.userStudy.create({ data })
    return result
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserStudyWhereUniqueInput;
    where?: Prisma.UserStudyWhereInput;
    orderBy?: Prisma.UserStudyOrderByWithRelationInput;
  }): Promise<UserStudy[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const result = await this.prisma.userStudy.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return result
  }

  async findOne(where: Prisma.UserStudyWhereUniqueInput): Promise<UserStudy | null> {
    const result = await this.prisma.userStudy.findUnique({ where })
    return result
  }

  // async update(where: Prisma.UserStudyWhereUniqueInput, data: Prisma.UserStudyUpdateInput): Promise<UserStudy> {
  //   const result = await this.prisma.userStudy.update({ where, data })
  //   return result
  // }

  async remove(where: Prisma.UserStudyWhereUniqueInput): Promise<UserStudy> {
    const result = await this.prisma.userStudy.delete({ where })
    return result
  }
}
