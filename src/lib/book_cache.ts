import * as fs from "fs";
import { IsbndbBook } from "../../types/isbndb_types";

export default interface BookCache {
  read: (key: string) => IsbndbBook;
  write: (key: string, value: IsbndbBook) => IsbndbBook;
}
