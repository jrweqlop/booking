import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty({ type: String })
    lineIdUser: string
}
