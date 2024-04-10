import { Injectable } from '@nestjs/common';
import imagekit from './imagekit.api';
import { FileObject, UploadResponse } from 'imagekit/dist/libs/interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagekitService {
  constructor(private readonly configService: ConfigService) {}
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<Pick<UploadResponse, 'url' | 'fileId'>> {
    if (!file) return null;

    const env = this.configService.get<string>('NODE_ENV') || 'dev';

    try {
      const { fileId, url } = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: `${env}/products`,
      });

      return { fileId, url };
    } catch (error) {
      return null;
    }
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const uploadedFiles = await Promise.all(
      files.map((file) => this.uploadFile(file)),
    );
    const urls = uploadedFiles.map((file) => file.url);
    const fileIds = uploadedFiles.map((file) => file.fileId);
    return { urls, fileIds };
  }

  async getFile(imageId: string): Promise<Pick<FileObject, 'url' | 'fileId'>> {
    const { fileId, url } = await imagekit.getFileDetails(imageId);
    return { fileId, url };
  }

  async deleteFile(imageId: string) {
    if (!imageId) return null;
    try {
      await imagekit.deleteFile(imageId);
      return { success: true };
    } catch (error) {
      throw new Error('Error: deleting image failed. Reason: ' + error);
    }
  }

  async deleteFiles(imageId: string[]) {
    if (!imageId) return null;
    try {
      await imagekit.bulkDeleteFiles(imageId);
      return { success: true };
    } catch (error) {
      throw new Error('Error: deleting image failed. Reason: ' + error);
    }
  }
}
