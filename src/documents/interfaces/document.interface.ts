export interface Document {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
  }