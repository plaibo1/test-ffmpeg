import fs from "node:fs";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";

import { Request, Response } from "express";
import { getNormalizeFilePath } from "../../utils/getNormalizeFilePath";

/**
 * @deprecated need refactor
 * @param req Request
 * @param res Response
 * @returns void
 */

export const merge2VideosController = async (req: Request, res: Response) => {
  const videoFiles = req.files as Express.Multer.File[];

  if (Number(videoFiles?.length) < 2 || typeof videoFiles === "undefined") {
    return res.status(400).json({
      message: "Необходимо загрузить два видеофайла для объединения.",
    });
  }

  // Путь для сохранения объединённого видео
  const mergedVideoPath = path.join(__dirname, "output", "merged_video.mp4");

  // Конфигурируем FFmpeg для объединения видео
  videoFiles.forEach((file) => {
    ffmpeg.ffprobe(file.path, (err, metadata) => {
      if (err) {
        console.error("Ошибка при анализе файла:", err);
        return res.status(400).send("Невозможно определить формат видео.");
      }

      console.log("Формат видео:", metadata.format.format_name); // Выводим информацию о формате
    });
  });

  const ffmpegCommand = ffmpeg();

  videoFiles.forEach((file) => {
    ffmpegCommand.input(getNormalizeFilePath(file.path));
  });

  ffmpegCommand
    .complexFilter([
      {
        filter: "concat",
        options: { n: videoFiles.length, v: 1, a: 1 },
      },
    ])
    .outputOptions(["-c:v libx264", "-crf 23", "-preset veryfast", "-c:a aac"])
    .on("end", () => {
      // Отправляем объединённое видео клиенту
      res.download(mergedVideoPath, "merged_video.mp4", (err) => {
        if (err) console.error(err);

        // Удаляем временные файлы после отправки
        videoFiles.forEach((file: Express.Multer.File) =>
          fs.unlinkSync(file.path)
        );
        fs.unlinkSync(mergedVideoPath);
      });
    })
    .on("error", (err) => {
      // TODD: clear cache videos
      console.error("Ошибка при объединении:", err);
      res.status(500).json({ message: "Произошла ошибка при обработке видео" });
    })
    .mergeToFile(mergedVideoPath, "./temp");
};
