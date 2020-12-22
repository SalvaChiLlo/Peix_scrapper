const database = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: process.env.DB_PASS,
    database: "sondeo_practicas",
  },
});

startAnalyzing();
function startAnalyzing() {
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
    .select("")
    .from("oferta")
    .where("analyzed", "=", "false")
    .then((response) => {
      analyze(response);
      setTimeout(() => {}, 1000 * 60 * 60);
    });
}

let counter = {};
function analyze(data) {
  data.forEach((element) => {
    let description = element.description.split(" ");

    description.forEach((word) => {
      addWord(word);
    });

    let profile = element.profile.split(" ");

    profile.forEach((word) => {
      addWord(word);
    });

    let observation = element.observation.split(" ");

    observation.forEach((word) => {
      addWord(word);
    });

    database("oferta")
      .where("id", "=", element.id)
      .update({ analyzed: true })
      .then((response) => {});
  });

  // console.log(counter);
}

function addWord(word) {
  database
    .transaction((trx) => {
      trx
        .select("*")
        .from("palabra")
        .where("palabra", "=", word)
        .then((response) => {
          // console.log(response[0]);
          if (response[0]) {
            return trx("palabra")
              .where("palabra", "=", word)
              .increment({ cantidad: 1 })
              .returning("*")
              .then((res) => console.log(res, "UPDATE"));
          } else {
            return trx("palabra")
              .insert({ palabra: word, cantidad: 1 })
              .returning("*")
              .then((res) => console.log(res, "INSERT"));
          }
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then((resp) => {
      // console.log("Transaccion completed");
    })
    .catch((err) => {
      // console.log("Transaction not completed", err);
    });
}

exports.analyze = startAnalyzing;
