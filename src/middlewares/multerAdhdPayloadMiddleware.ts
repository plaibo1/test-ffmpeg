import multer, { MulterError } from "multer";
import { multerStorage } from "../utils/multerStorage";
import { type NextFunction, type Request, type Response } from "express";

const upload = multer({ storage: multerStorage });

export const multerAdhdPayloadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.fields([
    { name: "overlay", maxCount: 1 },
    { name: "layout", maxCount: 1 },
  ])(req, res, (err: any) => {
    if (err) {
      if (err instanceof MulterError) {
        // Обработка ошибок Multer
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("Превышен максимальный размер файла");
        }

        return res.status(400).send(`Ошибка загрузки файла: ${err.message}`);
      } else {
        // Обработка других ошибок
        return next(err);
      }
    }

    next();
  });
};
