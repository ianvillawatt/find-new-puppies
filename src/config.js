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
    "https://ruffstartrescue.org/adopt/adoptable-animals/dogs-puppies/",
    ".animal-list li a"
  ),
];

function createConfig(url, name, link = name) {
  return {
    url,
    selectors: {
      name,
      link,
    },
  };
}
