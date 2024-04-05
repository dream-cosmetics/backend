import { Inject, Injectable } from '@nestjs/common';
import { saveFiles, deleteFiles } from 'src/shared/utils/file.utils';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class FileService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async uploadFiles(files: Array<Express.Multer.File>) {
    if (!files) return;
    return saveFiles(files);
  }

  async removeFiles(fileNames: string[]) {
    if (!fileNames) return;
    return deleteFiles(fileNames);
  }

  getImageUrl(imageUrl: string) {
    const baseUrl = `${this.request.protocol}://${this.request.get('host')}/public/`;
    return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  }

  getImageUrls(images: string[]) {
    return images.map((image) => this.getImageUrl(image));
  }
}
