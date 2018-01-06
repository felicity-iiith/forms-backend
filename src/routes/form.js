import koaRouter from "koa-joi-router";

import * as ctrl from "../controllers/form";
import retrieveForm from "../middleware/retrieveForm";

const Joi = koaRouter.Joi;
const router = koaRouter();
router.prefix("/forms");

const routes = [
  {
    method: "get",
    path: "/:formslug",
    handler: [retrieveForm, ctrl.get],
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
  },
  {
    method: "post",
    path: "/:formslug/response",
    handler: [retrieveForm, ctrl.postResponse],
    validate: {
      params: {
        formslug: Joi.string().token()
      },
      type: "form",
      body: {
        response: Joi.string()
      }
    },
    meta: {
      swagger: {
        summary: "Post form response",
        tags: ["forms"]
      }
    }
  },
  {
    method: "get",
    path: "/:formslug/responses",
    handler: [retrieveForm, ctrl.getResponses],
    validate: {
      params: {
        formslug: Joi.string().token()
      }
    },
    meta: {
      swagger: {
        summary: "Get Form responses (if admin)",
        tags: ["forms"]
      }
    }
  }
];

router.route(routes);
export default router;
