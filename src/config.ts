export interface Config {
  agency: string;
  petsUrl: string;
  selectors: {
    petContainer: string; // parent for all other selectors
    petLink?: string; // default to container
    petNameText?: string; // default to link,
    next?: string; // may not be needed
  };
  petLinkAttr: string; // default = href
  getPetUrl: (petsUrl: string, petLinkAttr: string) => string;
}

// rg navigates to urls with javascript instead of using href
const rescueGroupsLinkExtractor: Config["getPetUrl"] = (
  petsUrl,
  petLinkAttr
) => {
  /*function onclick(){
    "toolkitFocusPet_0(0, someId, someIndex);return false;"
  }*/
  const functionBody = petLinkAttr.split(/\n/)[1],
    inParens = functionBody.split(/\(|\)/)[1],
    [_, id, index] = inParens.split(",");
  return `${petsUrl}/#action_0=pet&animalID_0=${id.trim()}&petIndex_0=${index.trim()}`;
};

const defaultConfig = {
  petLinkAttr: "href",
  getPetUrl: (_: unknown, petLinkAttr: string) => petLinkAttr,
};

const rgConfig = {
  petLinkAttr: "onclick",
  getPetUrl: rescueGroupsLinkExtractor,
};

export const configs: Config[] = [
  {
    agency: "Secondhand Hounds",
    petsUrl: "https://www.secondhandhounds.org/dogs-for-adoption",
    selectors: {
      petContainer: ".rgtkSearchResultsCell",
      petLink: ".rgtkSearchPetInfoAnimalName a",
    },
    ...rgConfig,
  },
  {
    agency: "Ruff Start",
    petsUrl:
      "https://ruffstartrescue.org/adopt/adoptable-animals/dogs-puppies/",
    selectors: {
      petContainer: "ul.animal-list li",
      petLink: "p a",
    },
    ...defaultConfig,
  },
  {
    agency: "No Dog Left Behind",
    petsUrl: "https://ndlbrescue.org/adoptable-dogs",
    selectors: {
      petContainer: ".rgtkSearchResultsTable tr",
      petNameText: "#rgtkSearchPetInfoAnimalName",
      next: "#rgtkSearchNextPageLinkTop_0 a", // won't be an `a` on last page
    },
    ...rgConfig,
  },
  {
    agency: "Humane Society",
    petsUrl: "https://www.animalhumanesociety.org/adoption/dogs",
    selectors: {
      petContainer: "div.animal",
      petLink: ".field--name-name a",
    },
    ...defaultConfig,
  },
  {
    agency: "Pet Haven",
    petsUrl: "https://pethavenmn.org/adopt/adoptable-dogs/",
    selectors: {
      petContainer: ".pets .dog",
      petLink: ".description a",
      petNameText: ".name a",
    },
    ...defaultConfig,
  },
  {
    agency: "Spot's Last Stop",
    petsUrl: "https://spotslaststop.org/adopt/adoptable-dogs/",
    selectors: {
      petContainer: ".adoptable-dog",
      petLink: "a.btn-default",
    },
    ...defaultConfig,
  },
];
