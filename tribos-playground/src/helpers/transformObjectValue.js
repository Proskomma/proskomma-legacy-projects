import * as _ from "lodash";
//const deepdash = require("deepdash/standalone");

//const deepMapKeys = (obj, fn) =>
//Array.isArray(obj)
//? obj.map((val) => deepMapKeys(val, fn))
//: typeof obj === "object"
//? Object.keys(obj).reduce((acc, current) => {
//const key = fn(current);
//const val = obj[current];
//acc[key] =
//val !== null && typeof val === "object" ? deepMapKeys(val, fn) : val;
//return acc;
//}, {})
//: obj;

//export const transformObjectValue2 = (object, transKey, transformer) => {
//console.log('transform')
//return deepMapKeys(object, (obj, key) => {
//console.log(key);
//if (key ===  transKey) {
//return transformer(obj[key]);
//}
//return key;
//});
//};

//export const transformObjectValue = (object, keyToFind, transform) => {
//
//console.log("mapping deep", typeof object, object);
//return deepMapKeys(object, (key) => {
//if (key === "tribos") {
//return transform(object[key]);
//}
//return object[key];
//if (key === keyToFind) {
//console.log("about to transform ", key);
//return transform(value);
//}
//return value;
//});
//};

const findPathsToKey = (options) => {
  let results = [];

  (function findKey({ key, obj, pathToKey }) {
    const oldPath = `${pathToKey ? pathToKey + "." : ""}`;
    if (obj.hasOwnProperty(key)) {
      results.push(`${oldPath}${key}`);
      return;
    }

    if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
      for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
          if (Array.isArray(obj[k])) {
            for (let j = 0; j < obj[k].length; j++) {
              findKey({
                obj: obj[k][j],
                key,
                pathToKey: `${oldPath}${k}[${j}]`,
              });
            }
          }

          if (obj[k] !== null && typeof obj[k] === "object") {
            findKey({
              obj: obj[k],
              key,
              pathToKey: `${oldPath}${k}`,
            });
          }
        }
      }
    }
  })(options);

  return results;
};

export const transformObjectValue = (object, keyToFind, transform) => {
  const paths = findPathsToKey({obj: object, key: keyToFind});

  paths.forEach((path) => {
    _.update(object, path, (item) => {
      return transform(item);
    });
  });

  return object;
};

export default transformObjectValue;
