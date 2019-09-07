import axios from "axios";
import { IsbndbResponse } from "../types/isbndb_types";

export default class Isbndb {
  private apiKey: string;
  private host: string = "api2.isbndb.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getBook(isbn: string): Promise<IsbndbResponse> {
    const response = await axios.get(`/book/${isbn}`, {
      baseURL: `https://${this.host}/`,
      headers: {
        Authorization: this.apiKey
      }
    });
    return response.data;
  }
}
