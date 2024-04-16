import { rename, rmSync, unlink } from 'fs';
import { resolve } from 'path';
import { IFileImage, IFilesImage } from '../../common/interfaces/index';

const rootPathUploadDir = resolve(__dirname, `../../../uploads`);

//** rename the file of image */
export const renameFile = (filePath: string, newPath: string) => {
  const path = `${rootPathUploadDir}${newPath}`;
  rename(filePath, path, (err) => {
    if (err) {
      return 0;
    }
  });
};

//** delete multiple file */
export const deleteMulFile = function (files: string[], mode = 'file') {
  switch (mode) {
    case 'file':
      files.forEach((file) => {
        const path = `${rootPathUploadDir}${file}`;
        rmSync(path, { force: true });
      });
      break;
    case 'array':
      files.forEach((file) => {
        const path = `${rootPathUploadDir}${file}`;
        rmSync(path, { force: true });
      });
      break;
    default:
      break;
  }
};

//** upload multiple file */
export const uploadMulFile = function (files: IFileImage[]): string[] {
  const filesPath = [];
  console.log(files);
  if (files && files.length > 0) {
    files.forEach((file) => {
      const path = `/images/${file.filename}`;
      filesPath.push(path);
    });
  }

  return filesPath;
};

//** upload single file
export const uploadSingleFile = function (file: IFileImage) {
  if (file) {
    return `/images/${file.destination.substring(
      file.destination.lastIndexOf('\\') + 1,
    )}/${file.filename}`;
  }
};

// ** delete image file
export const deleteSingleFile = function (filePath: string) {
  if (filePath) {
    unlink(`${rootPathUploadDir}${filePath}`, (err) => {
      if (err) return 0;
    });
  }
};

// ** update image file

export const updateSingleFile = function (file: IFileImage, imageOld: string) {
  if (!file) return imageOld;

  rmSync(`${rootPathUploadDir}/${imageOld}`, { recursive: true, force: true });
  return `/images/${file.destination.substring(
    file.destination.lastIndexOf('\\') + 1,
  )}/${file.filename}`;
};
