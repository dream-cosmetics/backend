import ImageKit from 'imagekit';

import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const imagekit = new ImageKit({
  publicKey: configService.get<string>('IMAGEKIT_PUBLIK_KEY'),
  privateKey: configService.get<string>('IMAGEKIT_PRIVATE_KEY'),
  urlEndpoint: configService.get<string>('IMAGEKIT_URL_ENDPOINT'),
});
export default imagekit;
