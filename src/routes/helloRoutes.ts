import { Router } from "express";
import { getHelloWorld } from "../utils/getHelloWorld";

export const getHelloRoutes = () => {
  const router = Router();

  router.get("/test", (_, res) => {
    res.json({ hello: "world" });
  });

  router.get("/redirect", (_, res) => {
    res.redirect("/hello");
  });

  router.get("/:id", (_, res) => {
    res.json({ jamal: 123, ...getHelloWorld({ jamaica: "fooo" }) });
  });

  return router;
};
