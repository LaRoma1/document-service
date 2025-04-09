import { IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateDocumentDto {
  @ApiProperty({ 
    description: 'Métadonnées associées au document',
    required: false,
    // type: 'object',
    example: { category: 'invoice', tags: ['urgent', '2023'] }
   })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}