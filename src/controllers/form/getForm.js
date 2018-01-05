import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export default async function getForm(formslug) {
  try {
    const p = path.join(__dirname, "../../../forms", formslug + ".yml");
    const f = await readFile(p, "utf8");
    const doc = yaml.safeLoad(f);
    return doc;
  } catch (e) {
    return false;
  }
}
