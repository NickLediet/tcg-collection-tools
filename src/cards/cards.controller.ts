import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express'
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
  private readonly logger = new Logger(CardsController.name);

  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Res() res: Response) {
    try {
      return await this.cardsService.create(createCardDto)
    } catch(error) {
      const errorMessage = (error as Error).message

      this.logger.error(errorMessage)

      return res.status(HttpStatus.CONFLICT)
        .json({ error: errorMessage })
    }
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
