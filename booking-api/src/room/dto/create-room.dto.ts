import { ApiProperty } from "@nestjs/swagger"
import { EnumRoomStatus } from "@prisma/client"

export class CreateRoomDto {
    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: String })
    subroom: string

    @ApiProperty({ enum: EnumRoomStatus, default: EnumRoomStatus.AVAILABLE })
    status: EnumRoomStatus
}
