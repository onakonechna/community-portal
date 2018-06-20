const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');
const { entries } = require('./../../lib/utils');

const authorizerSnippet = {
  name: 'authorizer',
  resultTtlInSeconds: 300,
  identitySource: 'method.request.header.Authorization',
  identityValidationExpression: '.*',
  type: 'token',
}

function loadYAML(filename) {
  try {
    return yaml.safeLoad(fs.readFileSync(filename), 'utf8');
  } catch (error) {
    console.log(error);
  }
}

const config = loadYAML('./serverless.yml');

const regex = /^\${file\((.*)\)}/;
let match;
let func;
let events;

const publicFuncNames = config.custom.functions.public;

describe('authorizer yaml definition static test', () => {
  it('checks that all lambda functions except public ones have authorizer defined according to the authorizerSnippet', () => {
    for (let i = 0; i < config.functions.length; i++) {
      match = regex.exec(config.functions[i]);
      func = loadYAML(match[1]);

      for (let [funcName, funcConfig] of entries(func)) {
        if !('events' in funcConfig){
          continue;
        }
        events = funcConfig.events;
        for (let j = 0; j < events.length; j++) {
          Object.keys(events[j]).map((name) => {
            if (name === 'http' && !(_.includes(publicFuncNames, funcName)) {
              console.log(funcName);
              expect(events[j].http.authorizer).toEqual(authorizerSnippet);
            }
          };
        }
      }
    };
  };
};
