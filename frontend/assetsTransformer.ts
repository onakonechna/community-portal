const path = require('path');

module.exports = {
  process(src: any, filename: string, config: any, options: any) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  },
};
