const express = require("express");
const cors = require("cors");
const database = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: process.env.DB_PASS,
    database: "sondeo_practicas",
  },
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  console.log("req");
  database
    .select()
    .from("oferta")
    .then((response) => res.json(response));
});

app.get("/remuneracion", function (req, res) {
  database
    .raw(
      "select company_name, avg(remuneracion::numeric) from oferta group by company_name"
    )
    .then((response) => res.json(response.rows));
});

app.listen(3000, () => {
  console.log("App is running in port 3000");
});
