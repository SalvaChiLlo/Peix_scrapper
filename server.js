const express = require("express");
const cors = require("cors");
const database = require("knex")({
  client: "pg",
  connection: {
    host: "postgres://gxojsjqdznsveg:f850014133cf479b5b628004445235fe7d20c9302857b95c6f315e8044e2fe5a@ec2-18-211-171-122.compute-1.amazonaws.com:5432/d8gtoui997bn8c",
    user: "gxojsjqdznsveg",
    password: "f850014133cf479b5b628004445235fe7d20c9302857b95c6f315e8044e2fe5a",
    database: "d8gtoui997bn8c",
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

app.listen(process.env.PORT, () => {
  console.log("App is running in port 3000");
});
