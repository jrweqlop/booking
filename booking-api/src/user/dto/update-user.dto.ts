import { ApiProperty } from '@nestjs/swagger';
import { EnumUser } from '@prisma/client';

export class UpdateUserDto {

    @ApiProperty({ type: String })
    lineName: string

    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: String })
    lastname: string

    @ApiProperty({ type: String })
    email: string

    @ApiProperty({ type: String })
    phone: string
}

export class UpdateRoleUserDto {
    @ApiProperty({ enum: EnumUser, default: EnumUser.USER })
    phone: EnumUser
}