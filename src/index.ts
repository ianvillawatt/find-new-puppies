import cron from "node-cron";
import { scrape } from "./scrape";

cron.schedule("0 8-23 * * *", scrape);
