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
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { url, key } = await this.uploadService.uploadImage(file, 'profiles');
    return { message: 'Profile image uploaded', data: { url, key } };
  }

  @Post('book')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBookImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { url, key } = await this.uploadService.uploadImage(file, 'books');
    return { message: 'Book image uploaded', data: { url, key } };
  }

  @Delete()
  async deleteFile(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('File key is required');
    }

    await this.uploadService.deleteFile(key);
    return { message: 'File deleted', data: { key } };
  }
}
