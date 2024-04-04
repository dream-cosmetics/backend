import { Injectable } from '@nestjs/common';
import { saveFiles } from 'src/shared/utils/file.utils';

@Injectable()
export class FileService {
  async uploadFile(files: Array<Express.Multer.File>) {
    if (!files) return;

    return saveFiles(files);
  }
}
