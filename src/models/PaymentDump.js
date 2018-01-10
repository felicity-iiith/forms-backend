import Sequelize from "sequelize";
import db from "./db";

const PaymentDump = db.define("paymentdump", {
  account: Sequelize.STRING,
  body: Sequelize.JSON,
  hmacCheck: Sequelize.BOOLEAN
});

export default PaymentDump;
