import { extname, resolve } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import * as multer from 'multer';
export const multerOptions = {
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
  },
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const rootPathUploadDir = resolve(
        __dirname,
        `../../../${process.env.FOLDER_UPLOAD}/images/${
          file.method === 'POST'
            ? req.route.path.substring(req.route.path.lastIndexOf('/') + 1)
            : req.route.path.split('/')[2]
        }`,
      );
      if (!existsSync(`${rootPathUploadDir}`)) {
        mkdirSync(rootPathUploadDir, { recursive: true });
      }
      cb(null, rootPathUploadDir);
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
};
