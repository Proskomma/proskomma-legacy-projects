const test = require('tape');
const path = require('path');
const fse = require('fs-extra');
const ProskommaJsonValidator = require('../../src').default;

const testGroup = 'Smoke';

test(
    `docSetsPerf (${testGroup})`,
    async function (t) {
        try {
            t.plan(5);
            const validator = new ProskommaJsonValidator();
            t.throws(()=> validator.validate('banana', {}), 'Unknown');
            let validatorResult = validator.validate('docSetsPerf', {});
            t.notOk(validatorResult.isValid);
            t.equal(validatorResult.errors.length, 1);
            t.ok(validatorResult.errors[0].message.includes("docSets"));
            const goodPerf = fse.readJsonSync(path.resolve(path.join('test', 'test_data', 'fra_lsg_jon_docSets.json')));
            validatorResult = validator.validate('docSetsPerf', goodPerf);
            t.ok(validatorResult.isValid);
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `docSetPerf (${testGroup})`,
    async function (t) {
        try {
            t.plan(4);
            const validator = new ProskommaJsonValidator();
            let validatorResult = validator.validate('docSetPerf', {});
            t.notOk(validatorResult.isValid);
            t.equal(validatorResult.errors.length, 1);
            t.ok(validatorResult.errors[0].message.includes("selectors"));
            const goodPerf = fse.readJsonSync(path.resolve(path.join('test', 'test_data', 'fra_lsg_jon_docSet.json')));
            validatorResult = validator.validate('docSetPerf', goodPerf);
            t.ok(validatorResult.isValid);
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `documentPerf (${testGroup})`,
    async function (t) {
        try {
            t.plan(4);
            const validator = new ProskommaJsonValidator();
            let validatorResult = validator.validate('documentPerf', {});
            t.notOk(validatorResult.isValid);
            t.equal(validatorResult.errors.length, 1);
            t.ok(validatorResult.errors[0].message.includes("headers"));
            const goodPerf = fse.readJsonSync(path.resolve(path.join('test', 'test_data', 'fra_lsg_jon_document.json')));
            validatorResult = validator.validate('documentPerf', goodPerf);
            t.ok(validatorResult.isValid);
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `sequencePerf (${testGroup})`,
    async function (t) {
        try {
            t.plan(4);
            const validator = new ProskommaJsonValidator();
            let validatorResult = validator.validate('sequencePerf', {});
            t.notOk(validatorResult.isValid);
            t.equal(validatorResult.errors.length, 1);
            t.ok(validatorResult.errors[0].message.includes("blocks"));
            const goodSequencePerf = fse.readJsonSync(path.resolve(path.join('test', 'test_data', 'fra_lsg_jon_main_sequence.json')));
            validatorResult = validator.validate('sequencePerf', goodSequencePerf);
            t.ok(validatorResult.isValid);
        } catch (err) {
            console.log(err);
        }
    },
);
