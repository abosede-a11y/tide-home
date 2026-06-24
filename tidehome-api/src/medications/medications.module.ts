import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './medication.entity';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medication])],
  providers: [MedicationsService],
  controllers: [MedicationsController],
  exports: [MedicationsService],
})
export class MedicationsModule {}
