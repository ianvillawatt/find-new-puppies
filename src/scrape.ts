import puppeteer, { Page } from "puppeteer";
import { Config, configs } from "./config";
import { addPet, savePets } from "./petstore";

export async function scrape() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (const config of configs) {
    await page.goto(config.petsUrl);
    await scrapePets(page, config);
  }

  savePets();

  await browser.close();
}

async function scrapePets(page: Page, config: Config) {
  // wait for pets to appear
  await page.waitForSelector(config.selectors.petContainer);

  // extract pet data
  const result = await page.evaluate((config: Config) => {
    const { selectors } = config,
      pets = document.querySelectorAll(selectors.petContainer);

    const data = Array.from(pets).map((container) => {
      const get = (fallback: Element, selector?: string) => {
        return selector
          ? container.querySelector(selector) || fallback
          : fallback;
      };

      const petLink = get(container, selectors.petLink),
        petName = get(petLink, selectors.petNameText),
        petLinkAttr = (petLink[config.petLinkAttr] || "").toString();

      return {
        name: petName.textContent.trim() || "",
        petLinkAttr,
      };
    });

    if (config.selectors.next) {
      const next = document.querySelector(config.selectors.next);
      if (next) return { data, done: false };
    }

    return { data, done: true };
  }, config as Record<string, any>);

  result.data.forEach((pet) =>
    addPet(
      pet.name,
      config.getPetUrl(config.petsUrl, pet.petLinkAttr),
      config.agency
    )
  );

  if (!result.done) {
    await page.waitForSelector(config.selectors.next);
    await page.click(config.selectors.next);
    await page.waitForNetworkIdle();
    await scrapePets(page, config);
  }
}
