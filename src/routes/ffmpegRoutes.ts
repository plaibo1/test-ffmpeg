import path from "node:path";
import multer from "multer";

import { Request, Router } from "express";

import {
  adhdController,
  merge2VideosController,
} from "../controllers/ffmpeg-controllers";

import { multerAdhdPayloadMiddleware } from "../middlewares/multerAdhdPayloadMiddleware";
import { multerStorage } from "../utils/multerStorage";

const upload = multer({ storage: multerStorage });

export const getFFmpegRoutes = () => {
  const router = Router();

  router.get("/test", (_, res) => {
    res.json({
      dirname: __dirname,
      resName: path.join(__dirname, "output", "merged_video.mp4"),
    });
  });

  router.post("/adhd", multerAdhdPayloadMiddleware, (req, res) => {
    adhdController(req, res);
  });

  router.post(
    "/merge-videos",
    upload.array("videos", 2),
    (req: Request, res) => {
      merge2VideosController(req, res);
    }
  );

  return router;
};
