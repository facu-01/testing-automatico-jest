import { describe, expect, it } from "@jest/globals";
import {
  Builder,
  By,
  ThenableWebDriver,
  until,
  WebDriver,
  WebElement,
} from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "selenium-webdriver/firefox";
import "chromedriver";
import * as fs from "fs/promises";

//#region helpers
const printElement = async (element: WebElement): Promise<void> => {
  const base64 = await element.takeScreenshot();

  const name = await element.getTagName();

  await fs.writeFile(`./images/${name}.png`, base64, "base64");
};

//#endregion

describe("test", () => {
  jest.setTimeout(10000);

  let driver: ThenableWebDriver;

  beforeAll(async () => {
    driver = new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("al incrementar la cantidad de productos, el total refleja la el precio final adecuadamente", async () => {
    //lanzamos el navegador
    await driver.get(
      "https://www.garbarino.com/vitrocalefactor-2000w-panel-de-vidrio-templado-westinghouse-negro-7365/p"
    );

    const precioUnitarioElement = await driver.wait(
      until.elementLocated(
        By.js(() =>
          document.getElementsByClassName(
            "vtex-product-price-1-x-currencyContainer vtex-product-price-1-x-currencyContainer--product-selling-price"
          )
        )
      ),
      5000
    );

    const botonComprarElement = await driver.wait(
      until.elementLocated(
        By.js(() =>
          document.getElementsByClassName(
            "vtex-add-to-cart-button-0-x-buttonText--product-buy-buttom"
          )
        )
      ),
      5000
    );

    // click boton
    await botonComprarElement.click();

    // get boton carrito
    const botonCarritoElement = await driver.wait(
      until.elementLocated(
        By.js(() =>
          document.getElementsByClassName(
            "vtex-button bw1 ba fw5 v-mid relative pa0 lh-solid br2 min-h-regular t-action icon-button dib bg-transparent b--transparent c-action-primary hover-b--transparent hover-bg-action-secondary hover-b--action-secondary pointer"
          )
        )
      ),
      5000
    );

    // click carrito
    await botonCarritoElement.click();

    // get boton aumentar cantidad
    const botonAumentarCantidadElement = await driver.wait(
      until.elementLocated(
        By.js(() =>
          document.querySelector('[aria-label="Aumentar la cantidad"]')
        )
      ),
      5000
    );

    // click aumentar cantidad
    await botonAumentarCantidadElement.click();

    // get subTota element
    const subTotalElement = await driver.wait(
      until.elementLocated(By.js(() => document.getElementById("items-price"))),
      5000
    );

    // get precios
    const precioUnitario = parseInt(
      (await precioUnitarioElement.getText()).replace(/[^a-zA-Z0-9 ]/g, "")
    );

    const subTotal = parseInt(
      (await subTotalElement.getText()).replace(/[^a-zA-Z0-9 ]/g, "")
    );

    console.log({ precioUnitario, subTotal });

    await printElement(subTotalElement);

    expect(subTotal).toBe(precioUnitario * 2);
  });
});
