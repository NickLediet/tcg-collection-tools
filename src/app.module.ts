import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ImportController } from './import/import.controller';
@Module({
  imports: [CardsModule, PrismaModule],
  controllers: [AppController, ImportController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
