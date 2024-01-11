import { Module } from '@nestjs/common'
import { CardsService } from './cards.service'
import { CardsController } from './cards.controller'
import { PrismaService } from 'src/prisma/prisma.service'
@Module({
  controllers: [CardsController],
  providers: [CardsService, PrismaService],
  imports: [PrismaService]
})
export class CardsModule {}
