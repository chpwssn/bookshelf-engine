import * as YAML from "yaml";
import * as fs from "fs";
import * as mustache from "mustache";
import BookCace from "./book_cache";
import ISBNdb from "./isbndb";
import { IsbndbBook, IsbndbResponse } from "../types/isbndb_types";
import OpenLibrary from "./openlibrary";

export interface IBookRecord {
  isbn: string;
  rating?: number;
  review?: string;
  title?: string;
  book: IsbndbBook;
}

export interface IBookshelfYaml {
  books: IBookRecord[];
}

class Bookshelf {
  private Books: IBookRecord[];
  private Cache: BookCace;
  private Isbnapi: ISBNdb;
  private OpenLibrary: OpenLibrary;

  constructor(cache: BookCace, isbnapi: ISBNdb) {
    this.Books = [];
    this.Cache = cache;
    this.Isbnapi = isbnapi;
    this.OpenLibrary = new OpenLibrary();
  }

  private sanitizeIsbn(isbn: string): string {
    return isbn.replace(/-/, "");
  }

  private async fetchBookInformationFromProvider(
    isbn: string,
    fetch: (isbn: string) => Promise<IsbndbResponse>
  ): Promise<IsbndbBook> {
    const sanitizedIsbn = this.sanitizeIsbn(isbn);
    try {
      return this.Cache.read(sanitizedIsbn);
    } catch {
      try {
        const apiResponse = await fetch(isbn);
        this.Cache.write(sanitizedIsbn, apiResponse.book);
        return apiResponse.book;
      } catch (e) {
        const err = `Couldn't find information for ISBN: ${isbn}`;
        console.log(err);
        throw err;
      }
    }
  }

  private async fetchBookInformation(isbn: string): Promise<IsbndbBook> {
    // TODO: Refactor to map an array of functions instead
    // const resolvers = [this.OpenLibrary.getBook, this.Isbnapi.getBook];
    let result = null;
    try {
      console.log(`Trying openlibrary ${isbn}`);
      result = await this.fetchBookInformationFromProvider(
        isbn,
        this.OpenLibrary.getBook
      );
    } catch {
      console.log(`Trying isbnapi ${isbn}`);
      result = await this.fetchBookInformationFromProvider(
        isbn,
        this.Isbnapi.getBook.bind(this.Isbnapi)
      );
    }
    return result;
  }

  public async fromFile(path: string): Promise<void> {
    const fileContents = fs.readFileSync(path, "utf8");
    const parsedContents: IBookshelfYaml = YAML.parse(fileContents);
    parsedContents.books = await Promise.all(
      parsedContents.books.map(async book => {
        let bookData = null;
        let error = null;
        try {
          bookData = await this.fetchBookInformation(book.isbn);
          return {
            ...book,
            book: bookData
          };
        } catch (errMsg) {
          return {
            ...book,
            error: errMsg
          };
        }
      })
    );
    this.Books = parsedContents.books;
  }

  public toHtml(templatePath: string): string {
    const templateContents = fs.readFileSync(templatePath, "utf8");
    mustache.parse(templateContents);
    return mustache.render(templateContents, {
      books: this.Books.sort((a: IBookRecord, b: IBookRecord) => {
        let titleA =
          a.book === undefined ? (a.title ? a.title : "") : a.book.title_long;
        titleA = titleA.replace(/^the\s+/i, "");
        let titleB =
          b.book === undefined ? (b.title ? b.title : "") : b.book.title_long;
        titleB = titleB.replace(/^the\s+/i, "");
        return titleA.localeCompare(titleB);
      })
    });
  }
}

export default Bookshelf;
