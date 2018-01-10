import yaml from "js-yaml";
import fs from "fs";
import path from "path";

let config = {};
try {
  const p = path.join(__dirname, "./config.yml");
  const f = fs.readFileSync(p, "utf8");
  config = yaml.safeLoad(f);
  Object.keys(config).forEach(
    key =>
      (config[key].instamojoUrl =
        config[key].instamojoUrl || "https://www.instamojo.com/api/1.1")
  );
} catch (e) {
  // eslint-disable-next-line
  console.warn("No payment config found. Payment requests will fail.");
}

export default config;
