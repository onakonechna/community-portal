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

export {
  entries,
};
