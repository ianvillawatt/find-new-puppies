import puppeteer from "puppeteer";
import { Config, configs } from "./config";
import { addPet, savePets } from "./petstore";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (const config of configs.slice(0, 1)) {
    await page.goto(config.petsUrl);

    const scrapePets = async () => {
      await page.waitForSelector(config.selectors.petContainer);

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
            name: petName.textContent || "",
            petLinkAttr,
          };
        });

        if (config.selectors.next) {
          const next = document.querySelector(config.selectors.next);
          if (next) {
            (next as HTMLElement).click();
            return { data, done: false };
          }
        }

        return { data, done: true };
      }, config as Record<string, any>);

      result.data.forEach((pet) =>
        addPet(
          pet.name,
          config.getPetUrl(config.petsUrl, pet.petLinkAttr),
          config.petsUrl
        )
      );

      if (!result.done) {
        await page.waitForNavigation();
        scrapePets();
      }
    };

    await scrapePets();
  }

  savePets();

  //await browser.close();
})();
