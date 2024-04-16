export type IFileImage = Pick<
  Express.Multer.File,
  'fieldname' | 'filename' | 'path' | 'destination'
>;

export type IFilesImage = Pick<
  Express.Multer.File,
  'fieldname' | 'filename' | 'path' | 'destination'
>[];
