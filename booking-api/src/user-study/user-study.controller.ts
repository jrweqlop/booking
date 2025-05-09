import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { UserStudyService } from './user-study.service';
import { CreateUserStudyDto } from './dto/create-user-study.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Prisma, UserStudy } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { BookingService } from 'src/booking/booking.service';
import * as dayjs from 'dayjs'
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@Controller('user-study')
export class UserStudyController {
  constructor(private readonly userStudyService: UserStudyService,
    private readonly userService: UserService,
    private readonly bookingService: BookingService
  ) { }

  @Post()
  @ApiCreatedResponse({ description: 'Success create User Study' })
  @ApiNotFoundResponse({ description: 'No have Id' })
  async create(@Body() body: CreateUserStudyDto) {
    const data: Prisma.UserStudyCreateInput = {
      User: {
        connect: {
          id: body.userId
        }
      },
      Booking: {
        connect: {
          id: body.bookingId
        }
      }
    }
    const checkUser = await this.userService.findOne({ id: +body.userId })
    if (!checkUser) throw new NotFoundException('No have User Id.')
    const checkBooing = await this.bookingService.findOne({ id: body.bookingId })
    if (!checkBooing) throw new NotFoundException('NO have Booking Id.')
    const result = await this.userStudyService.create(data)
    return result
  }

  @ApiQuery({ type: String, name: 'userId', required: false })
  @ApiQuery({ type: String, name: 'bookingId', required: false })
  @ApiQuery({ type: Date, name: 'start', required: false })
  @ApiQuery({ type: Date, name: 'end', required: false })
  @Get()
  @ApiOkResponse({ description: 'Success Find Data User Study' })
  findAll(
    @Query('userId') userId: string,
    @Query('bookingId') bookingId: string,
    @Query('start') start: Date,
    @Query('end') end: Date,
  ): Promise<UserStudy[]> {
    const where: Prisma.UserStudyWhereInput = {
      userId: userId ? +userId : undefined,
      bookingId: bookingId ? bookingId : undefined,
      createdat: {
        gte: start ? dayjs(start).toDate() : undefined,
        lte: end ? dayjs(end).toDate() : undefined
      }
    }
    return this.userStudyService.findAll({ where });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Success delete User Study Id' })
  @ApiNotFoundResponse({ description: 'No have User Study Id' })
  async remove(@Param('id') id: string): Promise<UserStudy> {
    const where: Prisma.UserStudyWhereUniqueInput = { id: +id }
    const check = await this.userStudyService.findOne(where)
    if (!check) throw new NotFoundException("No have User Study Id")
    const result = await this.userStudyService.remove(where)
    return result
  }
}
