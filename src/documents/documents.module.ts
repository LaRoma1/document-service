import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentEntity } from './entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
})
export class DocumentsModule {}
