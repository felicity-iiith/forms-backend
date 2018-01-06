import Sequelize from "sequelize";
import db from "./db";

import User from "./User";

const Response = db.define("response", {
  formslug: Sequelize.STRING,
  response: Sequelize.JSON
});

Response.belongsTo(User);

export default Response;
