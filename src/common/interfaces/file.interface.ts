export type IFileImage = Pick<
  Express.Multer.File,
  'fieldname' | 'filename' | 'path'
>;

export type IFilesImage = Pick<
  Express.Multer.File,
  'fieldname' | 'filename' | 'path'
>[];
