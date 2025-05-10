import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ type: String })
    lineIdUser: string

    @ApiProperty({ type: String })
    lineName: string

    @ApiProperty({ type: String })
    imageUrl: string

}

export class ChangeAvatar {
    @ApiProperty({ type: String })
    imageUrl?: string

}