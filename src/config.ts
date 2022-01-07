export interface Config {
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

const rgConfig = {
  petLinkAttr: "onclick",
  getPetUrl: rescueGroupsLinkExtractor,
};

export const configs: Config[] = [
  {
    petsUrl: "https://www.secondhandhounds.org/dogs-for-adoption",
    selectors: {
      petContainer: ".rgtkSearchResultsCell",
      petLink: ".rgtkSearchPetInfoAnimalName a",
    },
    ...rgConfig,
  },
  {
    petsUrl:
      "https://ruffstartrescue.org/adopt/adoptable-animals/dogs-puppies/",
    selectors: {
      petContainer: "ul.animal-list li",
      petLink: "p a",
    },
    petLinkAttr: "href",
    getPetUrl: (_, petLinkAttr: string) => {
      return `https://ruffstartrescue.org${petLinkAttr}`;
    },
  },
  {
    petsUrl: "https://ndlbrescue.org/adoptable-dogs",
    selectors: {
      petContainer: ".rgtkSearchResultsTable tr",
      petNameText: "#rgtkSearchPetInfoAnimalName",
      next: "#rgtkSearchNextPageLinkTop_0 a", // won't be an `a` on last page
    },
    ...rgConfig,
  },
  {
    petsUrl: "https://www.animalhumanesociety.org/adoption/dogs",
    selectors: {
      petContainer: "div.animal",
      petLink: ".field--name-name a",
    },
    petLinkAttr: "href",
    getPetUrl: (_, petLinkAttr) => {
      return `https://animalhumanesociety.org${petLinkAttr}`;
    },
  },
  {
    petsUrl: "https://pethavenmn.org/adopt/adoptable-dogs/",
    selectors: {
      petContainer: ".pets .dog",
      petLink: ".description .a",
      petNameText: ".name a",
    },
    petLinkAttr: "href",
    getPetUrl: (_, petLinkAttr) => petLinkAttr,
  },
];
