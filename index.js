const scrap = require("./scrap");
const database = require("knex")({
  client: "pg",
  connection: {
    host: "ec2-18-211-171-122.compute-1.amazonaws.com",
    user: "gxojsjqdznsveg",
    password: "f850014133cf479b5b628004445235fe7d20c9302857b95c6f315e8044e2fe5a",
    database: "d8gtoui997bn8c",
  },
});

let i = 0;
function app() {
  console.log(
    "---------------------------------------------------------------------------"
  );
  console.log(
    "--------------------------NEW DAY NEW DAY NEW DAY--------------------------"
  );
  console.log(
    "---------------------------------------------------------------------------"
  );
  database
    .count("")
    .from("oferta")
    .then((response) =>
      console.log(response[0].count + "/ / / / /" + new Date())
    );
  const data = scrap.scrap();

  data.then((response) => {
    insertData(response)
  });

  setTimeout(() => {
    app();
  }, 1000 * 60 * 60);
}

app();

function insertData(data) {
  for (const key in data) {
    database("oferta")
      .insert({
        id: key,
        remuneracion: data[key].remuneracion,
        company_name: data[key].company_name,
        description: data[key].description,
        profile: data[key].profile,
        observation: data[key].observation,
        inserted: new Date(),
      })
      .then((response) => {
        {
          console.log("<-----------------" + key + " ADDED----------------->");
          return 'OK';
        }
      })
      .catch((err) => {
        console.log(key + " already exists");
      });
  }
}
