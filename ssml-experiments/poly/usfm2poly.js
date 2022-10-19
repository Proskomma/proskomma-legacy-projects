const fse = require('fs-extra');
const path = require('path');

const {Proskomma} = require('proskomma');

const ts = Date.now();

if (process.argv.length !== 3) {
    console.log('USAGE: node usfm2poly.js <path/to/config.json>');
    process.exit(1);
}

const configPath = path.resolve(process.argv[2]);
let configData;
try {
    configData = fse.readFileSync(configPath);
} catch (err) {
    console.log(`ERROR: Could not read from config file '${configPath}'`);
    process.exit(1);
}

let config;
try {
    config = JSON.parse(configData);
} catch (err) {
    console.log(`ERROR: Could not parse content of config file '${configPath}' as JSON: ${err}`);
    process.exit(1);
}

config.sourceDir = path.resolve(path.dirname(configPath), config.sourceDir);
config.outputDir = path.resolve(path.dirname(configPath), config.outputDir);
if (fse.existsSync(config.outputDir)) {
    console.log(`ERROR: output dir ${config.outputDir} already exists`);
    process.exit(1);
}
fse.ensureDirSync(config.outputDir);

function handleQuery(query) {
    const bookCode = query.data.documents[0].bookCode;
    const bookName = query.data.documents[0].bookName;
    const ret = [`${bookName}.\n\n`];
    for (const block of query.data.documents[0].mainSequence.blocks) {
        for (const item of block.items) {
            if (item.type === 'token') {
                ret.push(item.subType === 'lineSpace' ? " " : item.payload);
            } else if (item.type === 'scope' && item.subType === 'start') {
                if (item.payload.startsWith('chapter')) {
                    ret.push(`${config.i18n.chapterTemplate.replace('%%', item.payload.split('/')[1])}.\n\n`);
                }
            }
        }
        ret.push("\n\n");
    }
    fse.writeFileSync(path.join(config.outputDir, `${bookCode}.txt`), ret.join(""));
}

for (
    const contentPath of
    fse.readdirSync(config.sourceDir)
        .filter(cp => !cp.includes('FRT'))
        .map(cp => path.join(config.sourceDir, cp))
    ) {
    console.log(contentPath);

    try {
        content = fse.readFileSync(contentPath);
    } catch (err) {
        console.log(`ERROR: Could not read from USFM/USX file '${contentPath}'`);
        process.exit(1);
    }

    let contentType = contentPath.split('.').pop().toLowerCase();
    if (contentType === 'sfm') {
        contentType = 'usfm'
    }

    const query = '{ documents { bookCode: header(id:"bookCode") bookName: header(id:"toc") mainSequence { blocks { items { type subType payload } } } } }'

    const pk = new Proskomma();

    let selectors = {
        lang: {name: 'eng'},
        abbr: {name: 'eng'},
    };

    pk.importDocument(
        selectors,
        contentType,
        content,
    );

    pk.gqlQuery(query)
        .then(output => handleQuery(output))
        .catch(err => console.log(`ERROR: Could not run query: '${err}'`));
}
console.log(`Processed in ${Date.now() - ts} msec\nOutput is in ${config.outputDir}`)