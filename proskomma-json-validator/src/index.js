import Ajv from 'ajv';
import docSetsSchema from './schema/docSetsSchema.json';
import docSetSchema from './schema/docSetSchema.json';
import documentSchema from './schema/documentSchema.json';
import sequenceSchema from './schema/sequenceSchema.json';
import blockOrGraftSchema from './schema/blockOrGraftSchema.json';
import contentElementSchema from './schema/contentElementSchema.json';

class ProskommaJsonValidator {

    constructor() {
        this.schema = {};
        for (const [key, schema] of [
            [
                'docSetsPerf',
                new Ajv()
                    .addSchema(contentElementSchema)
                    .addSchema(blockOrGraftSchema)
                    .addSchema(sequenceSchema)
                    .addSchema(documentSchema)
                    .addSchema(docSetSchema)
                    .compile(docSetsSchema)
            ],
            [
                'docSetPerf',
                new Ajv()
                    .addSchema(contentElementSchema)
                    .addSchema(blockOrGraftSchema)
                    .addSchema(sequenceSchema)
                    .addSchema(documentSchema)
                    .compile(docSetSchema)
            ],
            [
                'documentPerf',
                new Ajv()
                    .addSchema(contentElementSchema)
                    .addSchema(blockOrGraftSchema)
                    .addSchema(sequenceSchema)
                    .compile(documentSchema)
            ],
            [
                'sequencePerf',
                new Ajv()
                    .addSchema(contentElementSchema)
                    .addSchema(blockOrGraftSchema)
                    .compile(sequenceSchema)
            ],
        ]) {
            this.schema[key] = schema;
        }
    }

    validate(schemaKey, data) {
        if (!(schemaKey)) {
            throw new Error(`Unknown schema key '${schemaKey}'`)
        }
        const validator = this.schema[schemaKey];
        return {
            schemaKey,
            isValid: validator(data),
            errors: validator.errors,
        };
    }


};

export default ProskommaJsonValidator;
