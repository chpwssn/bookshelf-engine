import { Command, flags } from "@oclif/command";
import Base from "../base";
import * as fs from "fs";

export default class Build extends Base {
  static description = "build a bookshelf HTML file";

  static examples = [
    `$ bookshelf build -o bookshelf.html -t mytemplate.mustache mybookshelf.yml`
  ];

  static flags = {
    templatePath: flags.string({
      char: "t",
      description: "template path",
      required: true
    }),
    outputPath: flags.string({
      char: "o",
      description: "output file name",
      required: true
    })
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Build);
    const { file } = args;
    const { templatePath, outputPath } = flags;

    await this.bookshelf.fromFile(file);
    const html = this.bookshelf.toHtml(templatePath);
    fs.writeFileSync(outputPath, html);
  }
}
