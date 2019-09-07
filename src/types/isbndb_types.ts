export interface IsbndbBook {
  publisher: string;
  image: string;
  title_long: string;
  pages: number;
  date_published: string;
  authors: string[];
  title: string;
  isbn13: string;
  msrp: string;
  binding: string;
  publish_data: string;
  isbn: string;
}

export interface IsbndbResponse {
  book: IsbndbBook;
}
