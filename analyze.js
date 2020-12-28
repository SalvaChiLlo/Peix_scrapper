const database = require("knex")({
  client: "pg",
  connection: {
    host: "postgres://gxojsjqdznsveg:f850014133cf479b5b628004445235fe7d20c9302857b95c6f315e8044e2fe5a@ec2-18-211-171-122.compute-1.amazonaws.com:5432/d8gtoui997bn8c",
    user: "gxojsjqdznsveg",
    password: "f850014133cf479b5b628004445235fe7d20c9302857b95c6f315e8044e2fe5a",
    database: "d8gtoui997bn8c",
  },
});

startAnalyzing();
function startAnalyzing() {
  console.log(
    "---------------------------------------------------------------------------"
  );
  console.log(
    "--------------------------ANALYZE ANALYZE ANALYZE--------------------------"
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
      setTimeout(() => {
        startAnalyzing();
      }, 1000 * 60 * 60);
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
