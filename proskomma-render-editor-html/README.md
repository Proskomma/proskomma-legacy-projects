# Proskomma Render App HTML
## Rendering Scripture as HTML, per-chapter, using Proskomma

## Usage
```
npm install
cd scripts
node make_sequence_html.js ../test_data/fraLSG # Uses Proskomma to generate a JSON representation of the translation
                                             # and stores this inside the translation directory.
                                             # Only needed once per refresh of the succinct JSON or Proskomma.

node make_chapters.js ../test_data/fraLSG    # Creates a chapters directory inside translation directory.
```
