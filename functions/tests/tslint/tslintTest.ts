import { Linter, Configuration } from 'tslint';
import * as fs from 'fs';

const options = { fix: false };
const program = Linter.createProgram("tsconfig.json");

const configurationFilePath = 'tslint.json';
const configuration = Configuration.findConfiguration(configurationFilePath).results;

const linter = new Linter(options, program);
const filePaths = Linter.getFileNames(program);

let fileContents;
for (let filePath of filePaths){
  fileContents = fs.readFileSync(filePath, 'utf8');
  linter.lint(filePath, null, configuration);
}

const result = linter.getResult();

describe('tslint tests', () => {
  it('should not produce any errors', () => {
    expect(result.errorCount).toBe(0);
  });
});
