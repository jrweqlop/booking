import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { EnumRoomStatus } from '@prisma/client';

export class UpdateRoomDto {
    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: String })
    subroom: string

    @ApiProperty({ enum: EnumRoomStatus, default: EnumRoomStatus.AVAILABLE })
    status: EnumRoomStatus
}
