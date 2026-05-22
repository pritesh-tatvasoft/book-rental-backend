import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');
    this.bucket =
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'public';

    if (!supabaseUrl || !supabaseKey) {
      throw new InternalServerErrorException(
        'Supabase configuration is missing',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  isDataUrl(value?: string): boolean {
    return (
      typeof value === 'string' &&
      /^data:image\/[a-zA-Z+.-]+;base64,/.test(value)
    );
  }

  async uploadImage(file: any, folder: string): Promise<{ url: string; key: string }> {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException('No file provided for upload');
    }

    const extension = extname(file.originalname) || '.png';
    const filePath = `${folder}/${randomUUID()}${extension}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload image: ${error.message}`,
      );
    }

    return {
      url: this.getPublicUrl(filePath),
      key: filePath,
    };
  }

  async uploadBase64DataUrl(dataUrl: string, folder: string): Promise<string> {
    if (!dataUrl || !this.isDataUrl(dataUrl)) {
      throw new InternalServerErrorException('Invalid image data URL');
    }

    const matches = dataUrl.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!matches) {
      throw new InternalServerErrorException('Invalid image data URL format');
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const extension = this.getExtensionFromMimeType(contentType);
    const filePath = `${folder}/${randomUUID()}${extension}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload image: ${error.message}`,
      );
    }

    return this.getPublicUrl(filePath);
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mapping: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
    };

    return mapping[mimeType] ?? '.png';
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!filePath) {
      throw new InternalServerErrorException('File key is required');
    }

    const { error } = await this.supabase.storage.from(this.bucket).remove([filePath]);
    if (error) {
      throw new InternalServerErrorException(
        `Failed to delete file: ${error.message}`,
      );
    }
  }

  private getPublicUrl(path: string): string {
    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
