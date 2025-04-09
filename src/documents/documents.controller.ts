// src/documents/documents.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    Res,
    HttpStatus,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Express, Response } from 'express';
  import { createReadStream } from 'fs';
  import * as multer from 'multer';
  import * as path from 'path';
  import { DocumentsService } from './documents.service';
  import { CreateDocumentDto } from './dto/create-document.dto';
  import { UpdateDocumentDto } from './dto/update-document.dto';
  import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentEntity } from './entities/document.entity';
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });


  @ApiTags('documents')
  @Controller('documents')
  export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Télécharger un nouveau document' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Le fichier à télécharger',
          },
          metadata: {
            type: 'object',
            description: 'Métadonnées associées au document (optionnel)',
            example: { category: 'invoice', tags: ['urgent', '2023'] },
          },
        },
      },
    })
    @ApiResponse({
      status: 201,
      description: 'Le document a été créé avec succès',
      type: DocumentEntity,
    })
    @UseInterceptors(FileInterceptor('file', { storage }))
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() createDocumentDto: CreateDocumentDto,
    ) {
      return this.documentsService.create(file, createDocumentDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Récupérer tous les documents' })
    @ApiResponse({
      status: 200,
      description: 'Liste de tous les documents',
      type: [DocumentEntity],
    })
    async findAll() {
      return this.documentsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Récupérer un document par son ID' })
    @ApiResponse({
      status: 200,
      description: 'Document trouvé',
      type: DocumentEntity,
    })
    async findOne(@Param('id') id: string) {
      return this.documentsService.findOne(id);
    }
  
    @Get(':id/download')
    @ApiOperation({ summary: 'Télécharger un document par son ID' })
    @ApiResponse({
      status: 200,
      description: 'Document téléchargé avec succès',
      type: 'string',
    })
    async download(@Param('id') id: string, @Res() res: Response) {
      const document = await this.documentsService.findOne(id);
      const file = createReadStream(document.path);
      
      res.set({
        'Content-Type': document.mimeType,
        'Content-Disposition': `attachment; filename="${document.originalName}"`,
      });
      
      file.pipe(res);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un document existant' })
    @ApiResponse({
      status: 200,
      description: 'Document mis à jour avec succès',
      type: DocumentEntity,
    })
    async update(
      @Param('id') id: string,
      @Body() updateDocumentDto: UpdateDocumentDto,
    ) {
      return this.documentsService.update(id, updateDocumentDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un document' })
    @ApiResponse({
      status: 200,
      description: 'Document supprimé avec succès',
    })
    async remove(@Param('id') id: string) {
      await this.documentsService.remove(id);
      return { statusCode: HttpStatus.OK, message: 'Document successfully deleted' };
    }
  }