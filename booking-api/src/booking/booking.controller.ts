import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, EnumBookingStatus, Prisma, UserStudy } from '@prisma/client';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { BookingIdGen } from 'src/shared/GenId';
import { RoomService } from 'src/room/room.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserService } from 'src/user/user.service';

interface BookingTimeSlot extends Booking {
  UserStudy: UserStudy[]
}

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService,
    private readonly userServices: UserService,
    private readonly roomService: RoomService
  ) { }

  @ApiBearerAuth()
  @Post()
  @ApiCreatedResponse({ description: 'Success Create BOoking' })
  async create(@Body() body: CreateBookingDto) {
    console.log(body)
    const where: Prisma.BookingWhereInput = {
      start: body.start ?? undefined,
      end: body.end ?? undefined,
      roomId: body.roomId
    }
    console.log(where)
    const checkCreate = await this.bookingService.findAll({ where })
    checkCreate.forEach((item) => {
      console.log(item)
      console.log('เทียบเวลา : ', dayjs(body.start).diff(dayjs(item.start), 'hour', true))
      if (body.roomId === item.roomId) {
        console.log('เวลาชนกัน')
      } else {
        console.log('เวลาไม่ชนกัน')
      }
    })
    return checkCreate
    // const id = BookingIdGen()
    // const data: Prisma.BookingCreateInput = { ...body, id }
    // const where: Prisma.RoomWhereUniqueInput = { id: body.roomId }
    // const check = await this.roomService.findOne(where)
    // if (!check) throw new BadRequestException('No have Room Id')
    // const result = await this.bookingService.create(data);
    // return result
  }

  @Public()
  @ApiQuery({ enum: EnumBookingStatus, name: 'bookingStatus', required: false })
  @ApiQuery({ type: Date, name: 'start', required: false })
  @ApiQuery({ type: Date, name: 'end', required: false })
  @Get()
  @ApiOkResponse({ description: 'Success Query Booking' })
  async findAll(
    @Query('bookingStatus') bookingStatus: EnumBookingStatus,
    @Query('start') start: Date,
    @Query('end') end: Date
  ): Promise<Booking[]> {
    const where: Prisma.BookingWhereInput = {
      status: bookingStatus ?? undefined,
      start: {
        gte: start ? dayjs(start).startOf('day').toDate() : undefined,
      },
      end: {
        lte: end ? dayjs(end).endOf('day').toDate() : undefined
      },
    }
    const orderBy: Prisma.BookingOrderByWithAggregationInput = {
      createdat: 'desc'
    }
    const result = await this.bookingService.findAll({ where, orderBy });
    return result
  }

  @Public()
  @ApiQuery({ type: String, name: 'bookingId', required: false })
  @ApiQuery({ type: String, name: 'teacherId', required: false })
  @ApiQuery({ type: String, name: 'roomId', required: false })
  @ApiQuery({ type: Date, name: 'start', required: false })
  @ApiQuery({ type: Date, name: 'end', required: false })
  @Get('teacher')
  @ApiOkResponse({ description: 'Success Find Booking TimeSlot ALl' })
  @ApiNotFoundResponse({ description: 'Not Found Booking ID' })
  async findOne(
    @Query('bookingId') bookingId: string,
    @Query('teacherId') teacherId: string,
    @Query('roomId') roomId: string,
    @Query('start') start: Date,
    @Query('end') end: Date
  ): Promise<BookingTimeSlot[]> {
    if (!teacherId) {
      throw new NotFoundException("No have Teacher Id")
    }
    const findTeacher = await this.userServices.findOne({ id: +teacherId })
    if (!findTeacher || findTeacher.role !== 'TEACHER') {
      throw new NotFoundException('Id is not Teacher ')
    }
    const UserStudy: Prisma.BookingWhereInput['UserStudy'] = {
      some: {
        User: {
          id: teacherId ? +teacherId : undefined
        }
      }
    }
    const where: Prisma.BookingWhereInput = {
      id: bookingId ? bookingId : undefined,
      roomId: roomId ? +roomId : undefined,
      start: start ? {
        gte: dayjs(start).startOf('day').toDate()
      } : undefined,
      end: end ? {
        lte: dayjs(end).endOf('day').toDate()
      } : undefined,
      UserStudy: teacherId ? UserStudy : undefined
    }
    const include: Prisma.BookingInclude = {
      UserStudy: true
    }
    const result = await this.bookingService.findAll({ where, include }) as BookingTimeSlot[]
    if (!result) throw new NotFoundException('Not Found Booking ID')
    return result
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOkResponse({ description: 'Success Update Booking' })
  @ApiNotFoundResponse({ description: 'No have Booking ID' })
  async update(@Param('id') id: string, @Body() body: UpdateBookingDto): Promise<Booking> {
    const where: Prisma.BookingWhereUniqueInput = { id }
    const check = await this.bookingService.findOne(where)
    if (!check) throw new NotFoundException('No have Booking ID')
    const data: Prisma.BookingUpdateInput = body
    const result = await this.bookingService.update(where, data);
    return result
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Booking> {
    const where: Prisma.BookingWhereUniqueInput = { id }
    const check = await this.bookingService.findOne(where)
    if (!check) throw new NotFoundException('No have Booling Id')
    const result = await this.bookingService.remove(where)
    return result
  }
}
