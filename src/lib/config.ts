export default {
  apiKey: process.env.ISBNDB_API_KEY || "",
  cache: {
    basePath: process.env.BOOKSHELF_CACHE_DIR || "./"
  }
};
