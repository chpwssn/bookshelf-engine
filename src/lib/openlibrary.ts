import axios from "axios";
import { IsbndbResponse } from "../types/isbndb_types";

export default class OpenLibrary {
  public async getBook(isbn: string): Promise<IsbndbResponse> {
    const key = `ISBN:${isbn}`;
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=${key}&format=json&jscmd=data`
    );
    if (Object.keys(response.data).indexOf(key) == -1) {
      throw {
        response: {
          status: 404,
          statusText: "Not Found"
        }
      };
    }
    const data: any = response.data[key];
    const translatedData: IsbndbResponse = {
      book: {
        publisher: data.publishers && data.publishers[0].name,
        image: data.cover && data.cover.medium,
        title_long: data.title,
        pages: data.number_of_pages || "0",
        date_published: data.publish_date,
        authors: data.authors.map((author: any) => author.name),
        title: data.title,
        isbn13: data.identifiers && data.identifiers.isbn_13,
        msrp: "0",
        binding: "unknown",
        publish_date: data.publish_date,
        isbn
      }
    };
    return translatedData;
  }
}
