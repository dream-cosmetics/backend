import { Inject, Injectable } from '@nestjs/common';
import { saveFiles } from 'src/shared/utils/file.utils';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class FileService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async uploadFile(files: Array<Express.Multer.File>) {
    if (!files) return;
    return saveFiles(files);
  }

  getImageUrl(imageUrl: string) {
    const baseUrl = `${this.request.protocol}://${this.request.get('host')}/public/`;
    return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  }

  getImageUrls(images: string[]) {
    return images.map((image) => this.getImageUrl(image));
  }
}
