import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { promisify } from "util";

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
    ctx.state.form = form;
    return next();
  }
}
