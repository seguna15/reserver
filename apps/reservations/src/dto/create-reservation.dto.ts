import { Type } from "class-transformer";
import { IsDate, IsDefined, IsIn, IsNotEmptyObject, ValidateNested } from "class-validator";
import { CreateChargeDto } from "@app/common";

export enum Destination {
    MALDIVES = "Maldives",
    SEYCHELLES = "Seychelles",
    CAPE_VERDE ="Cape Verde"
}

export class CreateReservationDto {
    @IsDate()
    @Type(() => Date)
    startDate: Date;
    
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @IsIn([Destination.MALDIVES, Destination.SEYCHELLES, Destination.CAPE_VERDE])
    destination

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateChargeDto)
    charge: CreateChargeDto
}
