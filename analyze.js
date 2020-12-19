const fs = require("fs");
const jsdom = require("jsdom");

const data = JSON.parse(fs.readFileSync("./salida.txt").toString());

const {
  window: { document },
} = new jsdom.JSDOM(data[0]);