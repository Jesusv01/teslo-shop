import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  // console.log({ file });
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtencion = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtension.includes(fileExtencion)) {
    return callback(null, true);
  }
  callback(null, false);
};
