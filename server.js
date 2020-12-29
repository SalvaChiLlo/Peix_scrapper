const express = require("express");
const cors = require("cors");
const database = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
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
      "select company_name, avg(remuneracion AS NUMERIC(10,4)) from oferta group by company_name"
    )
    .then((response) => res.json(response.rows));
});

app.listen(process.env.PORT, () => {
  console.log("App is running in port 3000");
});
