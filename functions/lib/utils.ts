import * as _ from 'lodash';

// Helper iterator
// Usage:
// for (let [key, value] of entries(myObj)) {
//    // do something with key|value
// }
function* entries(obj: any) {
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

function getMethods(obj: any) {
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
  return _.remove(methods, (name: string) => { name === 'constructor' });
}

export {
  entries,
  getMethods,
};
