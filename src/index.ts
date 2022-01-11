import cron from "node-cron";
import { scrape } from "./scrape";

cron.schedule("0,15,30,45 8-23 * * *", () => scrape());
