import rp from "request-promise-native";
import paymentcfg from "../config/payment";
import { verifyHMAC } from "../helpers/payment";
import Response from "../models/Response";
import PaymentDump from "../models/PaymentDump";

export async function done(ctx) {
  const { payment_id, payment_request_id } = ctx.request.query;
  const { account } = ctx.params;
  var headers = {
    "X-Api-Key": paymentcfg[account].apiKey,
    "X-Auth-Token": paymentcfg[account].authToken
  };
  const res = await rp.get(
    `${paymentcfg[account].instamojoUrl}/payments/${payment_id}/`,
    { headers, json: true }
  );
  const status = res.payment.status === "Credit";
  const response = await Response.findOne({
    where: { payment_request_id: `${account}|${payment_request_id}` }
  });
  if (!response) return;
  if (status) await response.update({ payment_status: true });
  ctx.redirect(`${config.get("publicFrontendUrl")}/${response.formslug}`);
}

export async function webhook(ctx) {
  const { account } = ctx.params;
  const { body } = ctx.request;
  const hmacCheck = verifyHMAC(account, body);
  await PaymentDump.create({ account, body, hmacCheck });
  if (!hmacCheck) {
    ctx.status = 400;
    return;
  }
  const status = body.status === "Credit";
  const response = await Response.findOne({
    where: { payment_request_id: `${account}|${body.payment_request_id}` }
  });
  if (!response) return;
  if (status) await response.update({ payment_status: true });
  ctx.body = { status };
}
