import ffmpeg from "fluent-ffmpeg";
import { getNormalizeFilePath } from "../../utils/getNormalizeFilePath";

/**
 *
 * @param layout - path to base video
 * @param overlay - path to video that in front of base video
 */
export const adhd = ({
  layout,
  overlay,
  outputPath,
}: {
  layout: Express.Multer.File;
  overlay: Express.Multer.File;
  outputPath: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(getNormalizeFilePath(layout.path))
      .input(getNormalizeFilePath(overlay.path))
      .complexFilter([
        // Масштабирование overlay до 1/4 высоты фона
        "[1:v]scale=-1:ih/4[overlay]",
        // Наложение overlay на центр фона по горизонтали и внизу по вертикали
        "[0:v][overlay]overlay=x=(main_w-overlay_w)/2:y=main_h-overlay_h:shortest=1",
      ])
      .outputOptions([
        '-map "[v]?"', // Выбираем видеопоток
        "-map 0:a", // Аудио из фонового видео
        "-c:v libx264", // Кодек для видео
        "-c:a aac", // Кодек для аудио
        "-shortest", // Останавливаемся, как только заканчивается одно видео
      ])
      .save(outputPath)
      .on("end", () => {
        console.log("Processing finished successfully");
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("!!!!! ====== Error during processing:", err);
        reject(err);
      });
  });
};
