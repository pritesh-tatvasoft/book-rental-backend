import {
  BadRequestException,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile')
  @ApiOperation({ summary: 'Upload a profile image to Supabase' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile image uploaded successfully',
    schema: {
      example: {
        success: true,
        message: 'Profile image uploaded',
        data: {
          url: 'https://your-supabase-url.supabase.co/storage/v1/object/public/profiles/abc123.png',
          key: 'profiles/abc123.png',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { url, key } = await this.uploadService.uploadImage(file, 'profiles');
    return { message: 'Profile image uploaded', data: { url, key } };
  }

  @Post('book')
  @ApiOperation({ summary: 'Upload a book image to Supabase' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Book image file',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Book image uploaded successfully',
    schema: {
      example: {
        success: true,
        message: 'Book image uploaded',
        data: {
          url: 'https://your-supabase-url.supabase.co/storage/v1/object/public/books/def456.png',
          key: 'books/def456.png',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadBookImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { url, key } = await this.uploadService.uploadImage(file, 'books');
    return { message: 'Book image uploaded', data: { url, key } };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete an uploaded file from Supabase storage' })
  @ApiQuery({
    name: 'key',
    required: true,
    description: 'The Supabase storage key for the file to delete',
    example: 'profiles/abc123.png',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'File deleted',
        data: { key: 'profiles/abc123.png' },
      },
    },
  })
  async deleteFile(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('File key is required');
    }

    await this.uploadService.deleteFile(key);
    return { message: 'File deleted', data: { key } };
  }
}
