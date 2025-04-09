// src/documents/documents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './interfaces/document.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { Repository } from 'typeorm';

const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class DocumentsService {
    private readonly uploadDir = path.join(process.cwd(), 'uploads');

    constructor(
      @InjectRepository(DocumentEntity)
      private documentRepository: Repository<DocumentEntity>,
    ) {
      this.ensureUploadDirExists();
    }
  
    private async ensureUploadDirExists() {
      if (!await existsAsync(this.uploadDir)) {
        await mkdirAsync(this.uploadDir, { recursive: true });
      }
    }

  async create(file: Express.Multer.File, createDocumentDto: CreateDocumentDto): Promise<Document> {
    const id = uuidv4();
    const now = new Date();
    
    const document: Document = {
      id,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      createdAt: now,
      updatedAt: now,
      metadata: createDocumentDto.metadata || {},
    };

    const savedDocument = await this.documentRepository.save(document);
    return savedDocument;
  }

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id);
    
    if (updateDocumentDto.filename) {
      document.filename = updateDocumentDto.filename;
    }
    
    if (updateDocumentDto.metadata) {
      document.metadata = {
        ...document.metadata,
        ...updateDocumentDto.metadata,
      };
    }
    
    document.updatedAt = new Date();
    const updatedDocument = await this.documentRepository.save(document);
    
    return updatedDocument;
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);
    
    // Supprimer le fichier physiquement
    if (await existsAsync(document.path)) {
      await unlinkAsync(document.path);
    }
    
    await this.documentRepository.delete(id);
  }

  async getFilePath(id: string): Promise<string> {
    const document = await this.findOne(id);
    return document.path;
  }
}