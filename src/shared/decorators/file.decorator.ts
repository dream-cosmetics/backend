import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileMimetypeFilter } from '../filters/file.filter';

export const FileImageDecorator = (
  fieldName = 'images',
  maxCount = 2,
  maxFileSizeInMB = 1,
) =>
  applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxCount, {
        limits: { fileSize: maxFileSizeInMB * 1024 * 1024 },
        fileFilter: fileMimetypeFilter('image'),
      }),
    ),
  );
