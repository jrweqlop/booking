import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/PrismaService/prisma.service';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [RoomModule, UserModule],
  controllers: [BookingController],
  providers: [BookingService, PrismaService],
  exports: [BookingService]
})
export class BookingModule { }
