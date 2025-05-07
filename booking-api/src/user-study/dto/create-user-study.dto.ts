import { ApiProperty } from "@nestjs/swagger";

export class CreateUserStudyDto {
    @ApiProperty({ type: String })
    bookingId

    @ApiProperty({ type: Number })
    userId: number
}
