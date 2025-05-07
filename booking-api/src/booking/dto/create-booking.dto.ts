import { ApiProperty } from "@nestjs/swagger"
import { EnumBookingStatus } from "@prisma/client"

export class CreateBookingDto {

    @ApiProperty({ type: String })
    title: string

    @ApiProperty({ type: Number })
    roomId: number

    @ApiProperty({ type: String })
    note: string

    @ApiProperty({ enum: EnumBookingStatus, default: EnumBookingStatus.OTHER })
    status: EnumBookingStatus

    @ApiProperty({ type: Date })
    start: Date

    @ApiProperty({ type: Date })
    end: Date
}
