import fs from "node:fs";
import path from "node:path";
import { Request, Response } from "express";
import { adhd } from "../../domain/ffmpeg-services";

interface IAdhdPayload {
  overlay?: Express.Multer.File[];
  layout?: Express.Multer.File[];
}

export const adhdController = async (req: Request, res: Response) => {
  const files = req.files as IAdhdPayload;

  if (!files || !files?.overlay || !files?.layout) {
    return res.status(400).json({
      message: "Должны быть загружены оба файла: overlay и layout",
    });
  }

  const { layout, overlay } = files;
  const [[layoutVideo], [overlayVideo]] = [layout, overlay];
  const outputPath = path.join("output", "adhd_video.mp4");

  try {
    const resultPath = await adhd({
      layout: layoutVideo,
      overlay: overlayVideo,
      outputPath,
    });

    res.download(resultPath, "adhd_video.mp4", (err) => {
      if (err) {
        console.error("Ошибка отправки файла:", err);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Произошла ошибка при обработке видео" });
  } finally {
    fs.unlink(layoutVideo.path, () => {});
    fs.unlink(overlayVideo.path, () => {});
  }
};
