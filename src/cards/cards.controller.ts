import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BaseController } from './shared/base.controller';

@Controller('cards')
export class CardsController extends BaseController {
  constructor(private readonly cardsService: CardsService) { super() }

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Res() response: Response) {
    this.logger.debug(createCardDto)
    try {
      const createdCard = await this.cardsService.create(createCardDto)
      return response
        .status(HttpStatus.CREATED)
        .json(createdCard)
    } catch(error) {
      const errorMessage = (error as Error).message
      return this.sendErrorResponse({ 
        errorMessage, 
        statusCode: HttpStatus.CONFLICT,
        response
      })
    }
  }

  @Get()
  async findAll() {
    return await this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(':scryfall_id')
  remove(@Param('scryfall_id') scryfallid: string) {
    return this.cardsService.remove(scryfallid)
  }
}
