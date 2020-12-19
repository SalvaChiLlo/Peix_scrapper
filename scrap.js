const puppeteer = require("puppeteer");
const jsdom = require("jsdom");
const fs = require("fs");

scrap();
async function scrap() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const response = await page.goto(
      "https://intranet.inf.upv.es/int/aplic_intranet/peixboot/alumnos/listado_ofertas_5_detalle.php"
    );
    const body = await response.text();

    const {
      window: { document },
    } = new jsdom.JSDOM(body);

    let res = {};

    document.querySelectorAll("#div_contenido > div").forEach((element) => {
      const code = getOfferCode(element);
      const price = getPrice(element);
      const companyName = getCompanyName(element);
      const description = getDescription(element, code);
      const profile = getProfile(element, code);
      const observacion = getObservaciones(element, code);
      res[code] = {
        remuneracion: price,
        company_name: companyName,
        description: description,
        profile: profile,
        observation: observacion,
      };
    });
    fs.writeFileSync("./salida.json", JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
  }
}

function getPrice(element) {
  let price = element
    .querySelector("div > div:nth-child(5) > div:nth-child(3) > span > b")
    .textContent.trim();

  price = price.match(/(\d+)/)[0];

  return price;
}

function getOfferCode(element) {
  let code = element
    .querySelector("div > div:nth-child(5) > div:nth-child(1)")
    .textContent.trim();

  const regex = /\(Código Oferta:(\d+)\)/g;
  code = regex.exec(code)[1];
  return parseInt(code);
}

function getCompanyName(element) {
  let name = element
    .querySelector("div > div:nth-child(7) > div:nth-child(1) > p")
    .textContent.trim()
    .replace("                        ,", " ,");
  return name;
}

function getDescription(element, code) {
  let description = element
    .querySelector(
      `#detalle-${code} > div > div:nth-child(1) > div.col-xs-offset-3.col-xs-9.col-md-offset-0.col-md-9`
    )
    .textContent.trim()
    .toLowerCase();
  const regex = /^[a-zA-Z ]*$/;
  description = description
    .replace("à", "a")
    .replace("á", "a")
    .replace("é", "e")
    .replace("è", "e")
    .replace("í", "i")
    .replace("ó", "o")
    .replace("ò", "o")
    .replace("ú", "u")
    .replace("ç", "c")
    .replace("ñ", "n")
    .replace("ó", "o")
    .replace(/[\W_]+/g, " ");
  return description;
}

function getProfile(element, code) {
  let profile = element
    .querySelector(
      `#detalle-${code} > div > div:nth-child(3) > div.col-xs-offset-3.col-xs-9.col-md-offset-0.col-md-9`
    )
    .textContent.trim()
    .toLowerCase();

  profile = profile
    .replace("á", "a")
    .replace("à", "a")
    .replace("é", "e")
    .replace("è", "e")
    .replace("í", "i")
    .replace("ó", "o")
    .replace("ò", "o")
    .replace("ú", "u")
    .replace("ç", "c")
    .replace("ñ", "n")
    .replace("ó", "o")
    .replace(/[\W_]+/g, " ");

  return profile;
}

function getObservaciones(element, code) {
  let observacion = element.querySelector(
    `#detalle-${code} > div > div:nth-child(10) > div.col-xs-offset-3.col-xs-9.col-md-offset-0.col-md-9`
  );

  if (observacion) observacion = observacion.textContent;
  else observacion = "";
  observacion = observacion
    .trim()
    .replace("á", "a")
    .replace("à", "a")
    .replace("é", "e")
    .replace("è", "e")
    .replace("í", "i")
    .replace("ó", "o")
    .replace("ò", "o")
    .replace("ú", "u")
    .replace("ç", "c")
    .replace("ñ", "n")
    .replace("ó", "o")
    .replace(/[\W_]+/g, " ");

  return observacion;
}

exports.scrap = scrap;
