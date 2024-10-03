import path from "node:path";

export const getNormalizeFilePath = (filePath: string) => {
  return path.normalize(filePath).replace(/\\/g, "/");
};
