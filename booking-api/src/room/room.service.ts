import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/PrismaService/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    const result = await this.prisma.room.create({ data })
    return result
  }

  async findAll(): Promise<Room[]> {
    const result = await this.prisma.room.findMany({
      orderBy: {
        createdat: 'desc'
      }
    })
    return result
  }

  async findOne(where: Prisma.RoomWhereUniqueInput): Promise<Room | null> {
    const result = await this.prisma.room.findUnique({ where })
    return result
  }

  async update(where: Prisma.RoomWhereUniqueInput, data: Prisma.RoomUpdateInput): Promise<Room> {
    const result = await this.prisma.room.update({ where, data })
    return result
  }

  async remove(where: Prisma.RoomWhereUniqueInput): Promise<Room> {
    const result = await this.prisma.room.delete({ where })
    return result
  }
}
