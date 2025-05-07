import { Controller, Post, Body, BadRequestException, ForbiddenException, Get, NotFoundException, Param, Patch, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { Prisma, Room } from '@prisma/client';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Success Create Room' })
  async create(@Body() body: CreateRoomDto): Promise<Room> {
    const data: Prisma.RoomCreateInput = body
    const result = await this.roomService.create(data)
    if (!result) throw new BadRequestException()
    return result
  }

  @Get()
  @ApiOkResponse({ description: "Success FindAll Room" })
  @ApiForbiddenResponse({ description: '' })
  async findAll(): Promise<Room[]> {
    const result = await this.roomService.findAll();
    if (!result) throw new ForbiddenException()
    return result
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Success Find Room Id' })
  @ApiNotFoundResponse({ description: '' })
  async findOne(@Param('id') id: string): Promise<Room> {
    const where: Prisma.RoomWhereUniqueInput = { id: +id }
    const result = await this.roomService.findOne(where);
    if (!result) throw new NotFoundException('No have Room ID')
    return result
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Success Update Room' })
  @ApiBadRequestResponse({ description: 'Fail Update Room' })
  async update(@Param('id') id: string, @Body() body: UpdateRoomDto) {
    const where: Prisma.RoomWhereUniqueInput = { id: +id }
    const check = await this.roomService.findOne(where)
    if (!check) throw new NotFoundException('No have Room ID')
    const data: Prisma.RoomUpdateInput = body
    const result = await this.roomService.update(where, data);
    if (!result) throw new BadRequestException()
    return result
  }


  @Delete(':id')
  @ApiNotFoundResponse({ description: 'No have Room ID' })
  @ApiOkResponse({ description: 'Success Delete Room' })
  async remove(@Param('id') id: string): Promise<Room> {
    const where: Prisma.RoomWhereUniqueInput = { id: +id }
    const check = await this.roomService.findOne(where)
    if (!check) throw new NotFoundException('No have Room ID')
    const result = await this.roomService.remove(where);
    return result
  }
}
