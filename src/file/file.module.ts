import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }), // Configure file storage location
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
