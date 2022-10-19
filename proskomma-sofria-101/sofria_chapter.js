const path = require('path');
const fse = require('fs-extra');
const {Proskomma} = require('proskomma');
if (process.argv.length !== 4) {
    throw new Error(`Expected exactly 2 arguments (srcPath, chapterNo)`);
}
const fqPath = path.resolve(process.argv[2]);
if (!fse.existsSync(fqPath)) {
    throw new Error(`srcPath '${fqPath}' does not exist`);
}
const chapter = parseInt(process.argv[3]);
if (isNaN(chapter)) {
    throw new Error(`Chapter should be a positive integer, not '${process.argv[3]}'`);
}
const pk = new Proskomma();
const content = fse.readFileSync(fqPath).toString();
const suffix = fqPath.split(".").reverse()[0];
pk.importDocument({lang: "xxx", abbr: "yyy"}, suffix, content);
const query = `{documents {sofria(indent: 2, chapter: ${chapter}) } }`;
const result = pk.gqlQuerySync(query);
console.log(result.data.documents[0].sofria);
