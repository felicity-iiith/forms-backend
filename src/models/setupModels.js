import db from "./db";
import User from "./User";

export default async function setupModels() {
  // If production then dont alter tables, but fail if table exists
  await db.sync({ force: !isProd });

  // If production then dont create mock models
  if (isProd) return;
  await User.create({
    username: "user1"
  });
}
