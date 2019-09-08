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
        const apiResponse = await this.OpenLibrary.getBook(isbn);
        this.Cache.write(sanitizedIsbn, apiResponse.book);
        return apiResponse.book;
      } catch (e) {
        const err = `${e.response.status}: ${e.response.statusText} for ISBN: ${isbn}`;
        console.log(err);
        throw err;
      }
    }
  }

  private async fetchBookInformation(isbn: string): Promise<IsbndbBook> {
    // TODO: Refactor to map an array of functions instead
    // const resolvers = [this.OpenLibrary.getBook, this.Isbnapi.getBook];
    try {
      return await this.fetchBookInformationFromProvider(
        isbn,
        this.OpenLibrary.getBook
      );
    } catch {
      return await this.fetchBookInformationFromProvider(
        isbn,
        this.Isbnapi.getBook
      );
    }
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
        if (a.book == undefined || b.book == undefined) return -1;
        return a.book.title_long.localeCompare(b.book.title_long);
      })
    });
  }
}

export default Bookshelf;
