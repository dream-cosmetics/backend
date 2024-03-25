import { Injectable } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File) {
    // Add your specific file upload logic here, including:

    // 1. Validation (e.g., file size, type, MIME type)
    // ...

    // 2. Custom filename generation (optional)
    // ...

    // 3. Advanced storage logic (optional)
    // ...

    // 4. Return relevant information or perform further actions
    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
