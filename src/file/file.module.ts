import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { path } from 'app-root-path';

@Module({
  imports: [
    MulterModule.register({ dest: `${path}/public` }), // Configure file storage location
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
