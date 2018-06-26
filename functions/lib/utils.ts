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
  let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
  _.remove(methods, (name: string) => { return name === 'constructor' });
  return methods;
}

export {
  entries,
  getMethods,
};
