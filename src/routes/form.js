import koaRouter from "koa-joi-router";

import * as ctrl from "../controllers/form";

const Joi = koaRouter.Joi;
const router = koaRouter();
router.prefix("/forms");

const routes = [
  {
    method: "get",
    path: "/:formslug",
    handler: [ctrl.get],
    validate: {
      params: {
        formslug: Joi.string().token()
      }
    },
    meta: {
      swagger: {
        summary: "Get Form",
        tags: ["forms"]
      }
    }
  }
];

router.route(routes);
export default router;
