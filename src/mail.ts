import "dotenv/config";
import { Pet } from "./petstore";
import { ServerClient } from "postmark";

const phrases = ["Woof woof!", "Look! A squirrel!", "Ruff ruff!"];

const recipients = [
  //"ian@leafqda.com",
  "iancharleswatt@gmail.com",
  "cillavilla@live.com",
];

const client = new ServerClient(process.env.MAIL_KEY);

export async function sendEmail(pets: Pet[]) {
  const phraseIndex = Math.floor(Math.random() * 3),
    phrase = phrases[phraseIndex],
    sortedPets = pets
      .slice()
      .sort((a, b) => ascending(a.name.toLowerCase(), b.name.toLowerCase()));

  if (!pets.length) return;

  for (const email of recipients) {
    await client.sendEmailWithTemplate({
      From: "puppybot@leafqda.com",
      To: email,
      TemplateAlias: "new-puppies",
      TemplateModel: {
        puppyCount: pets.length,
        pets: sortedPets, // name, link, agency
        phrase,
      },
    });
  }
}

function ascending<T = unknown>(a: T, b: T) {
  return a > b ? 1 : a < b ? -1 : 0;
}
