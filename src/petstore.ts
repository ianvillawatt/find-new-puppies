import * as fs from "fs";

export interface Pet {
  name: string;
  link: string;
  source: string;
  foundAt: number;
}

const foundPets: Pet[] = [];

const foundAt = Date.now();

export function addPet(name: string, link: string, source: string) {
  foundPets.push({ name, link, source, foundAt });
}

const fileName = "pets.json";

export function savePets() {
  let savedPets: Pet[] = [];

  try {
    savedPets = JSON.parse(fs.readFileSync(fileName, "utf-8"));
  } catch (err) {
    // no saved pets
  }

  const newPets = foundPets.filter((found) => {
    const same = savedPets.find((saved) => {
      return saved.name == found.name && saved.link == found.link;
    });

    return same ? false : true;
  });

  const petString = JSON.stringify(savedPets.concat(...newPets), null, 2);
  fs.writeFileSync(fileName, petString);
}
