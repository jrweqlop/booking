import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, EnumBookingStatus, Prisma, UserStudy } from '@prisma/client';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { BookingIdGen } from 'src/shared/GenId';
import { RoomService } from 'src/room/room.service';

interface BookingTimeSlot extends Booking {
  UserStudy: UserStudy[]
}

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService,
    private readonly roomService: RoomService
  ) { }

  @Post()
  @ApiCreatedResponse({ description: 'Success Create BOoking' })
  async create(@Body() body: CreateBookingDto) {
    const id = BookingIdGen()
    const data: Prisma.BookingCreateInput = { ...body, id }
    const where: Prisma.RoomWhereUniqueInput = { id: body.roomId }
    const check = await this.roomService.findOne(where)
    if (!check) throw new BadRequestException('No have Room Id')
    const result = await this.bookingService.create(data);
    return result
  }

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
      createdat: {
        gte: dayjs(start).startOf('day').toDate() ?? undefined,
        lte: dayjs(end).endOf('day').toDate() ?? undefined
      }
    }
    const result = await this.bookingService.findAll({ where });
    return result
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Success Find Booking TimeSlot ALl' })
  @ApiNotFoundResponse({ description: 'Not Found Booking ID' })
  async findOne(@Param('id') id: string): Promise<BookingTimeSlot> {
    const where: Prisma.BookingWhereUniqueInput = { id }
    const result = await this.bookingService.findOne(where) as BookingTimeSlot
    if (!result) throw new NotFoundException('Not Found Booking ID')
    return result
  }

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

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Booking> {
    const where: Prisma.BookingWhereUniqueInput = { id }
    const check = await this.bookingService.findOne(where)
    if (!check) throw new NotFoundException('No have Booling Id')
    const result = await this.bookingService.remove(where)
    return result
  }
}
