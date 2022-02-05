const { CONNECTION_STRING } = process.env;
const { user } = require("pg/lib/defaults");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const userId = 4;
const clientId = 3;

module.exports = {
  getUserInfo: (req, res) => {
    sequelize
      .query(
        `
      SELECT * FROM cc_clients c
      JOIN cc_users u ON c.user_id = u.user_id
      WHERE u.user_id = ${userId};
    `
      )
      .then((dbRes) => {
        // console.log(dbRes[0]);
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  updateUserInfo: (req, res) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      city,
      state,
      zipCode,
    } = req.body;
    sequelize
      .query(
        `
      UPDATE cc_users
      SET first_name = '${firstName}',
      last_name = '${lastName}',
      email = '${email}',
      phone_number = ${phoneNumber}
      WHERE user_id = ${userId};

      UPDATE cc_clients
      SET address = '${address}',
      city = '${city}',
      state = '${state}',
      zip_code = ${zipCode}
      WHERE user_id = ${userId};
    `
      )
      .then(() => res.sendStatus(200))
      .catch((err) => console.log(err));
  },
  getUserAppt: (req, res) => {
    sequelize
      .query(
        `
      SELECT * FROM cc_appointments
      WHERE client_id = ${clientId}
      ORDER BY date DESC;
    `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
};
