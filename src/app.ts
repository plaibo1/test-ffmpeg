import express from "express";
import { getHelloRoutes } from "./routes/helloRoutes";
import { getFFmpegRoutes } from "./routes/ffmpegRoutes";

export const app = express();

app.use("/api", getFFmpegRoutes());
app.use("/hello", getHelloRoutes());
