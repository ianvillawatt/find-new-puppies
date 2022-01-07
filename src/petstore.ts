import * as fs from "fs";
import { sendEmail } from "./mail";

export interface Pet {
  name: string;
  link: string;
  agency: string;
  foundAt: number;
}

const foundPets: Pet[] = [];

const foundAt = Date.now();

export function addPet(name: string, link: string, agency: string) {
  foundPets.push({ name, link, agency, foundAt });
}

const allPetsFileName = "pets-all.json";

export async function savePets() {
  let savedPets: Pet[] = [];

  try {
    savedPets = JSON.parse(fs.readFileSync(allPetsFileName, "utf-8"));
  } catch (err) {
    // no saved pets
  }

  const newPets = foundPets.filter((found) => {
    const same = savedPets.find((saved) => {
      return saved.name == found.name && saved.link == found.link;
    });

    return same ? false : true;
  });

  console.log(`Found ${newPets.length} new pets`);

  const writePetsToFile = (name: string, data: Pet[]) => {
    const petString = JSON.stringify(data, null, 2);
    fs.writeFileSync(name, petString);
  };

  await sendEmail(newPets);

  writePetsToFile("pets-new.json", newPets);
  writePetsToFile(allPetsFileName, savedPets.concat(...newPets));
}
