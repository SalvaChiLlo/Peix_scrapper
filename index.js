const scrap = require("./scrap");
const database = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "78787",
    database: "sondeo_practicas",
  },
});

let i = 0;
function app() {
  const data = scrap.scrap();

  data.then((response) => {
    insertData(response);
  });

  // database
  //   .select()
  //   .from("oferta")
  //   .then((response) => {
  //     console.log(response);
  //   });

  setTimeout(() => {
    console.log('---------------------------------------------------------------------------')
    console.log('--------------------------NEW DAY NEW DAY NEW DAY--------------------------')
    console.log('---------------------------------------------------------------------------')
    app();
  }, 1000 * 60 * 60 * 24);
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
      .then((response) =>
        console.log("<-----------------" + key + " ADDED----------------->")
      )
      .catch((err) => {
        console.log(key + " already exists")
      });
  }
}
