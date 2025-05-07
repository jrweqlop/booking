import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleUserDto, UpdateUserDto } from './dto/update-user.dto';
import { ApiBadGatewayResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnumUser, Prisma, User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiQuery({ type: String, name: 'lineIdUser', required: false })
  @ApiQuery({ type: String, name: 'name', required: false })
  @ApiQuery({ type: String, name: 'lastname', required: false })
  @ApiQuery({ type: String, name: 'phone', required: false })
  @ApiQuery({ type: String, name: 'email', required: false })
  @ApiQuery({ enum: EnumUser, name: 'role', required: false })
  @Get()
  @ApiOkResponse({ description: 'Success Create' })
  async findAll(
    @Query('lineIdUser') lineIdUser: string,
    @Query('name') name: string,
    @Query('lastname') lastname: string,
    @Query('phone') phone: string,
    @Query('email') email: string,
    @Query('role') role: EnumUser
  ): Promise<User[]> {
    const where: Prisma.UserWhereInput = {
      lineIdUser: lineIdUser ?? undefined,
      name: name ?? undefined,
      lastname: lastname ?? undefined,
      phone: phone ?? undefined,
      email: email ?? undefined,
      role: role ?? undefined
    }
    const result = await this.userService.findAll({ where });
    return result
  }

  @ApiQuery({ type: String, name: 'lineIdUser', required: false })
  @Get(':id')
  @ApiOkResponse({ description: 'Success Find User' })
  @ApiNotFoundResponse({ description: 'No have User Id' })
  async GetId(
    @Param("id") id: string,
    @Query('lineIdUser') lineIdUser: string
  ): Promise<User | null> {
    const where: Prisma.UserWhereUniqueInput = {
      id: id ? +id : undefined,
      lineIdUser: lineIdUser ?? undefined
    }
    const result = await this.userService.findOne(where)
    if (!result) throw new NotFoundException('No have User Id')
    return result
  }

  @ApiQuery({ type: String, name: 'lineIdUser', required: true })
  @Get('check/')
  async GetUser(
    @Query('lineIdUser') lineIdUser: string
  ): Promise<object> {
    const where: Prisma.UserWhereUniqueInput = { lineIdUser }
    const check = await this.userService.findOne(where)
    if (check) return { status: 200, message: "User Line Not Register", data: { Register: true } }
    return { status: 200, message: 'User Line ID Register', data: { Register: false } }
  }

  @Post()
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() body: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = body
    const where: Prisma.UserWhereUniqueInput = { lineIdUser: body.lineIdUser }
    const check = await this.userService.findOne(where)
    if (check) throw new BadRequestException('You have Register Line ID')
    const result = await this.userService.create(data);
    if (!result) throw new BadRequestException()
    return result
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Success Update" })
  @ApiNotFoundResponse({ description: 'Not Found User Id' })
  async patch(
    @Param("id") id: string,
    @Body() body: UpdateUserDto
  ): Promise<User> {
    const where: Prisma.UserWhereUniqueInput = { id: +id }
    const check = await this.userService.findOne(where)
    if (!check) throw new NotFoundException('Not Found User Id')
    const data: Prisma.UserUpdateInput = body
    const result = await this.userService.update(where, data)
    if (!result) throw new BadRequestException('Cannot update')
    return result
  }

  @Patch(':id/role')
  @ApiNotFoundResponse({ description: 'Not Found Id' })
  @ApiOkResponse({ description: 'Success Update Role User ID' })
  async PatchRole(
    @Param('id') id: string,
    @Body() body: UpdateRoleUserDto
  ): Promise<User> {
    const where: Prisma.UserWhereUniqueInput = { id: +id }
    const check = await this.userService.findOne(where)
    if (!check) throw new NotFoundException('Not Found User Id')
    const data: Prisma.UserUpdateInput = body
    const result = await this.userService.update(where, data)
    if (!result) throw new BadRequestException('Cannot update')
    return result
  }

  @Delete(":id")
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Not Found User' })
  async delete(
    @Param('id') id: string
  ): Promise<User> {
    const data: Prisma.UserWhereUniqueInput = { id: +id }
    const result = await this.userService.remove(data)
    return result
  }

}
