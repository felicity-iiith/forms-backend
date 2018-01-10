import rp from "request-promise-native";
import crypto from "crypto";
import paymentcfg from "../config/payment";

export async function getPaymentLink({
  account,
  purpose,
  amount,
  phone,
  email,
  name
}) {
  var headers = {
    "X-Api-Key": paymentcfg[account].apiKey,
    "X-Auth-Token": paymentcfg[account].authToken
  };
  var payload = {
    purpose,
    amount,
    phone,
    email,
    buyer_name: name,
    redirect_url: `${config.get("publicApiUrl")}/payments/${account}/done`,
    webhook: `${config.get("publicApiUrl")}/payments/${account}/webhook`,
    send_email: true,
    send_sms: false,
    allow_repeated_payments: false
  };

  const res = await rp.post(
    `${paymentcfg[account].instamojoUrl}/payment-requests/`,
    { form: payload, headers, json: true }
  );
  if (res.success)
    return {
      payment_request_id: res.payment_request.id,
      longurl: res.payment_request.longurl
    };
  else return false;
}

// https://support.instamojo.com/hc/en-us/articles/207816249-What-is-the-Message-Authentication-Code-in-Webhook
export function verifyHMAC(account, obj) {
  const hmac = crypto.createHmac("sha1", paymentcfg[account].salt);
  const keys = Object.keys(obj).sort();
  let catted = "";
  for (let key of keys) if (key != "mac") catted += obj[key] + "|";
  catted = catted.substring(0, catted.length - 1); // Remove trailing '|'
  hmac.update(catted);
  return hmac.digest("hex") == obj.mac;
}
