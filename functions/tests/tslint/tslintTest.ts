import { Linter, Configuration } from 'tslint';
import * as fs from 'fs';

const options = {};
const program = Linter.createProgram("tsconfig.json", "jestTestData/**/*");

const configurationFilePath = 'tslint.json';
const configuration = Configuration.findConfiguration(configurationFilePath).results;

let filePath;
let fileContents;
let linter;

describe('tslint tests', () => {
  filePath = 'tests/tslint/fixtures/tslintMissingSemicolon.ts';
  fileContents = fs.readFileSync(filePath, 'utf8');
  linter = new Linter(options, program);
  linter.lint(filePath, fileContents, configuration);
  const missingSemicolonResult = linter.getResult();

  it('should catch the missing semicolon error', () => {
    expect(missingSemicolonResult.errorCount).toBe(1);
    expect(missingSemicolonResult.failures[0].failure).toBe('Missing semicolon');
  });

  filePath = 'tests/tslint/fixtures/tslintVarAssignment.ts';
  fileContents = fs.readFileSync(filePath, 'utf8');
  linter = new Linter(options, program);
  linter.lint(filePath, fileContents, configuration);
  const varAssignmentResult = linter.getResult();

  it('should catch the var assignment error', () => {
    expect(varAssignmentResult.errorCount).toBe(1);
    expect(varAssignmentResult.failures[0].failure).toBe('Forbidden \'var\' keyword, use \'let\' or \'const\' instead');
  });
});
