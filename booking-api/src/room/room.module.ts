import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaService } from 'src/PrismaService/prisma.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService],
  exports: [RoomService]
})
export class RoomModule { }
