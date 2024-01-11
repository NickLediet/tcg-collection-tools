import { Logger, Injectable } from '@nestjs/common'
import { CreateCardDto } from './dto/create-card.dto'
import { UpdateCardDto } from './dto/update-card.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Card, Prisma } from '@prisma/client'

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const existingCard = await this.findByScryfallId(createCardDto.scryfall_id)

    if(existingCard) {
      throw Error(`A card with the scryfall_id of '${createCardDto.scryfall_id}' already exists`)
    }
    this.logger.log('Made it to line 19 of CardsService')
    return await this.prisma.card.create({ data: createCardDto })
  }

  async findAll() {
    return await this.prisma.card.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(scryfallId: string): Promise<Card> {
    try {
      return this.prisma.card.delete({
        where: {
          scryfall_id: scryfallId
        }
      })
    } catch(error) {
      throw new Error(`Unable to delete card entry with the scryfall_id of ${scryfallId}. It likely does not exist.`)
    }
  }

  findByScryfallId(scryfallId: string): Promise<Card | null> {
    try {
      return this.prisma.card.findFirst({
        where: {
          scryfall_id: scryfallId
        }
      })
    } catch(error) {
      this.logger.error(error)
      return null
    }
  }
}
