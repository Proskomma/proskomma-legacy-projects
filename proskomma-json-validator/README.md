# proskomma-json-validator
A JSON Schema Validator for Proskomma data

## Usage
```
import ProskommaJsonValidator from 'proskomma-json-validator;
const validatorResult = validator.validate('sequencePerf', {});
/*
=>
    {
      "schemaKey": "sequencePerf",
      "isValid": false,
      "errors": [
        {
          "instancePath": "",
          "schemaPath": "#/then/allOf/0/required",
          "keyword": "required",
          "params": {
            "missingProperty": "blocks"
          },
          "message": "must have required property 'blocks'"
        }
      ]
    }
*/
```
## Supported Schema
- docSetsPerf
- docSetPerf
- documentPerf
- sequencePerf
