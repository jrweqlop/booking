import { Module } from '@nestjs/common';
import { UserStudyService } from './user-study.service';
import { UserStudyController } from './user-study.controller';
import { PrismaService } from 'src/PrismaService/prisma.service';
import { UserModule } from 'src/user/user.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [UserModule, BookingModule],
  controllers: [UserStudyController],
  providers: [UserStudyService, PrismaService],
})
export class UserStudyModule { }
