import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {

  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy, 
  ){}
  
  async create(createReservationDto: CreateReservationDto, { email, _id: userId }: UserDto) {
    return this.paymentService.send(
      'create_charge', {
        ...createReservationDto.charge,
        email
      },
    ).pipe(
        map((res) => { 
          return this.reservationRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
            charge: res.amount_received/100,
          });
      }),
    );
    
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({_id})
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({_id});
  }

  async getByUser( {email, _id: userId}: UserDto) {
      const result = await this.reservationRepository.find({userId});
      const sortedResult = await result.sort((a,b) => { return  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()});
      return sortedResult;
      
  }


}

