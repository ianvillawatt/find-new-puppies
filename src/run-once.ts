import { configs } from "./config";
import { scrape } from "./scrape";

scrape(false, configs.slice(-1));
