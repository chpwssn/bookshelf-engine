import BookCache from "./book_cache";
import * as fs from "fs";
import * as path from "path";
import { IsbndbBook } from "../../types/isbndb_types";

class DiskCache implements BookCache {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  private pathForKey(key: string): string {
    return path.join(this.baseDir, `${key}.json`);
  }

  public read(key: string): IsbndbBook {
    const keyPath = this.pathForKey(key);
    try {
      fs.accessSync(keyPath, fs.constants.R_OK);
      const fileContents = fs.readFileSync(keyPath, "utf8");
      console.log(`Cache hit for ${key}`);
      return JSON.parse(fileContents.toString()) as IsbndbBook;
    } catch (err) {
      console.log(`Cache miss for ${key}`);
      throw "No cache";
    }
  }

  public write(key: string, value: IsbndbBook): IsbndbBook {
    const keyPath = this.pathForKey(key);
    fs.writeFileSync(keyPath, JSON.stringify(value));
    return value;
  }
}

export default DiskCache;
