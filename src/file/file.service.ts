import { Inject, Injectable } from '@nestjs/common';
import {
  saveFiles,
  deleteFiles,
  deleteFile,
} from 'src/shared/utils/file.utils';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class FileService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async uploadFiles(files: Array<Express.Multer.File>) {
    if (!files) return;
    const imageNames = await saveFiles(files);
    const imageUrls = this.getImageUrls(imageNames);
    return { imageNames, imageUrls };
  }

  async removeFiles(fileNames: string[]) {
    if (!fileNames) return;
    return deleteFiles(fileNames);
  }

  async removeFile(fileName: string) {
    if (!fileName) return;
    const imageUrl = this.getImageUrl(fileName);
    await deleteFile(fileName);
    return { fileName, imageUrl };
  }

  getImageUrl(imageUrl: string) {
    const baseUrl = `${this.request.protocol}://${this.request.get('host')}/public/`;
    return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  }

  getImageUrls(images: string[]) {
    return images.map((image) => this.getImageUrl(image));
  }
}
