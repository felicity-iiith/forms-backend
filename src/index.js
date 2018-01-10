import Koa from "koa";
import cors from "@koa/cors";

import routes from "./routes";

import { dbconnect } from "./models/db";
import setupModels from "./models/setupModels";

import authMiddleware from "./middleware/auth";
import "./helpers/payment";

async function setup() {
  await dbconnect();
  await setupModels();
  const app = new Koa();
  if (!isProd) app.use(cors());
  app.use(authMiddleware);
  app.use(routes);
  await app.listen(config.get("port"));
}

setup().then(() => {
  console.log("Server started on port " + config.get("port")); // eslint-disable-line
});
