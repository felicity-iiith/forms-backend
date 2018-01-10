import Sequelize from "sequelize";
import db from "./db";

import User from "./User";

const Response = db.define("response", {
  formslug: Sequelize.STRING,
  response: Sequelize.JSON,
  payment_request_id: {
    // form: account|payment_request_id
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
    defaultValue: null
  },
  payment_status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

Response.belongsTo(User);

export default Response;
