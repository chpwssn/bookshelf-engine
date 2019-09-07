import { Command, flags } from "@oclif/command";
import Bookshelf from "./lib/bookshelf";
import { IConfig } from "@oclif/config";
import DiskCache from "./lib/disk_cache";
import engineConfig from "./lib/config";
import Isbndb from "./lib/isbndb";

export default class Base extends Command {
  public bookshelf: Bookshelf;

  constructor(argv: string[], config: IConfig) {
    super(argv, config);
    this.bookshelf = new Bookshelf(
      new DiskCache(engineConfig.cache.basePath),
      new Isbndb(engineConfig.apiKey)
    );
  }
  run(): PromiseLike<any> {
    throw new Error("Method not implemented.");
  }
}
