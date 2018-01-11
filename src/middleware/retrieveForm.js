import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import Response from "../models/Response";

const readFile = promisify(fs.readFile);

async function getForm(formslug) {
  try {
    const p = path.join(__dirname, "../../forms", formslug + ".yml");
    const f = await readFile(p, "utf8");
    const doc = yaml.safeLoad(f);
    return doc;
  } catch (e) {
    return false;
  }
}

export default async function retrieveForm(ctx, next) {
  const { formslug } = ctx.params;
  const { user } = ctx.state;
  const form = await getForm(formslug);
  if (!form) {
    ctx.status = 404;
    return;
  } else {
    // Hide properties here
    form.isAdmin = form.admins.indexOf(user.username) != -1;
    form.admins = undefined;
    if (form.seats) {
      let seats_filled;
      if (!form.payment)
        seats_filled = await Response.count({ where: { formslug } });
      else
        seats_filled = await Response.count({
          where: { formslug, payment_status: true }
        });
      form.seats_left = form.seats - seats_filled;
      // Hack (might be needed coz no locking of seats)
      form.seats_left = form.seats_left < 0 ? 0 : form.seats_left;
    }
    ctx.state.form = form;
    return next();
  }
}
