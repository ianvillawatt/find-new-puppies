export const configs = [
  createConfig(
    "https://www.secondhandhounds.org/dogs-for-adoption",
    ".rgtkSearchPetInfoAnimalName a"
  ),
  createConfig(
    "https://ruffstartrescue.org/adopt/adoptable-animals/dogs-puppies/",
    ".animal-list li a"
  ),
  createConfig(
    "https://ndlbrescue.org/adoptable-dogs",
    "#rgtkSearchPetInfoAnimalName"
  ),
];

//https://www.animalhumanesociety.org/adoption/dogs
//https://pethavenmn.org/adopt/adoptable-dogs/

function createConfig(url, name, link = name, nextLink) {
  return {
    url,
    selectors: {
      name,
      link,
      nextLink,
    },
  };
}
