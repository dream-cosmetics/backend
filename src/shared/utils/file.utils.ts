import { path } from 'app-root-path';
import { ensureDir, writeFile, remove } from 'fs-extra';

const publicFoldername = 'public';
export const uploadPath = `${path}/${publicFoldername}`;

export const saveFile = async (file: Express.Multer.File) => {
  try {
    const { buffer, originalname } = file;
    const fileName = `${Date.now()}-${originalname}`;
    ensureDir(uploadPath);
    await writeFile(`${uploadPath}/${fileName}`, buffer);
    return fileName;
  } catch (error) {
    throw new Error('Error uploading image');
  }
};

export const saveFiles = async (files: Express.Multer.File[]) =>
  Promise.all(files.map(saveFile));

export const deleteFile = async (fileName: string) =>
  remove(`${uploadPath}/${fileName}`);

export const deleteFiles = async (fileNames: string[]) =>
  Promise.all(fileNames.map(deleteFile));

export const updateFile = async (
  existingFileName: string,
  image: Express.Multer.File,
) => {
  await deleteFile(existingFileName);
  return saveFile(image);
};

export const updateFiles = async (
  existingFileNames: string[],
  images: Express.Multer.File[],
) => {
  await Promise.all(existingFileNames.map(deleteFile));
  return saveFiles(images);
};
