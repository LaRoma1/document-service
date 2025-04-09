// src/documents/entities/document.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @ApiProperty({
    description: 'Identifiant unique du document',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nom du fichier',
    example: 'facture.pdf'
  })
  @Column()
  filename: string;

  @Column()
  originalName: string;

  @ApiProperty({
    description: 'Type MIME du fichier',
    example: 'application/pdf'
  })
  @Column()
  mimeType: string;

  @ApiProperty({
    description: 'Taille du fichier en octets',
    example: 123456
  })
  @Column('int')
  size: number;

  @ApiProperty({
    description: 'Chemin du fichier',
    example: '/uploads/facture.pdf'
  })
  @Column()
  path: string;

  @ApiProperty({
    description: 'Métadonnées associées au document',
    example: { category: 'invoice', tags: ['urgent', '2023'] }
  })
  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Date de création du document',
    example: '2023-07-14T12:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date de mise à jour du document',
    example: '2023-07-14T12:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
}