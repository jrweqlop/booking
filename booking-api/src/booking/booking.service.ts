import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/PrismaService/prisma.service';
import { Booking, Prisma, UserStudy } from '@prisma/client';

@Injectable()
export class BookingService {

  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    const result = await this.prisma.booking.create({ data })
    return result
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BookingWhereUniqueInput;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput;
    include?: Prisma.BookingInclude
  }): Promise<Booking[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.booking.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: include ?? {}
    });
  }

  async findOne(where): Promise<object | null> {
    const result = await this.prisma.booking.findUnique({ where, include: { UserStudy: true } })
    return result
  }

  async update(where: Prisma.BookingWhereUniqueInput, data: Prisma.BookingUpdateInput): Promise<Booking> {
    const result = await this.prisma.booking.update({ where, data })
    if (!result) throw new BadRequestException()
    return result
  }

  async remove(where: Prisma.UserStudyWhereUniqueInput): Promise<UserStudy> {
    const resutl = await this.prisma.userStudy.delete({ where })
    return resutl
  }
}
