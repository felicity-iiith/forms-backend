import koaRouter from "koa-joi-router";

import * as ctrl from "../controllers/payment";
import paymentcfg from "../config/payment";

const Joi = koaRouter.Joi;
const router = koaRouter();
router.prefix("/payments");

const routes = [
  {
    method: "get",
    path: "/:account/done",
    handler: [ctrl.done],
    validate: {
      query: {
        payment_id: Joi.string(),
        payment_request_id: Joi.string()
      },
      params: {
        account: Joi.string().valid(Object.keys(paymentcfg))
      }
    },
    meta: {
      swagger: {
        summary: "Payment Done",
        description:
          "Route redirected to on payment done. \n Redirects to next query param after updating data.",
        tags: ["payments"]
      }
    }
  },
  {
    method: "post",
    path: "/:account/webhook",
    handler: [ctrl.webhook],
    validate: {
      params: {
        account: Joi.string().valid(Object.keys(paymentcfg))
      },
      body: Joi.any(),
      type: "form"
    },
    meta: {
      swagger: {
        summary: "Payment Webhook",
        tags: ["payments"]
      }
    }
  }
];

router.route(routes);
export default router;
