.. _under-hood-architecture:

#################
Architecture v0.3
#################

.. image:: architecture.svg
   :alt: Proskomma Block Architecture

Documents entering Proskomma pass through a series of steps. The architecture has been designed so that each step tackles
one class of issues cleanly. This approach is in contrast to the typical USFM/USX processing model which tries to get from
the input format to the output format in one heroic leap.

Lexers
++++++

Lexers break the input document into an array of **pretokens**, such as

- printable text
- chapter/verse markers
- paragraph, character and word-level tags
- milestones
- attributes
- content that cannot be parsed

The USFM lexer uses regular expressions to split and then classify pretokens. The USX lexer uses SAX to produce output
equivalent to the USFM lexer. It would be possible to produce USFX and maybe OSIS lexers that could also feed into the
same downstream processing.

Parser Engine
+++++++++++++

Lexer output is fed into a parser engine that iterates over the pretokens. The parser engine implements a state machine
that tracks context as successive pretokens are processed. The parser outputs a tree representation of the
document using :ref:`Proskomma building blocks <user-model-building>`.

Parser Specs
++++++++++++

Most of the specifics of parsing are defined in a parser spec that is used by the parser engine. The parser spec is an array of
test-action tuples. The parser iterates over the parser spec tests and runs the first action for which the test passed. The behaviour
of the parser can be modified significantly by providing a different parser spec.

Tidier
++++++

Parsing USFM in a linear fashion tends to result in messy output. A typical example is that headings for a new chapter tend to
"stick" to the end of the preceding chapter rather than the start of the new chapter. (Fixing this during the main parsing operation
is not trivial since there may be multiple headings, maybe a section introduction...) The tidier scans the parser output and reorganises
it to make subsequence processing easier. Issues handled during this step include

- leading and trailing whitespace
- orphan headings
- empty paragraphs
- unclosed tags
- the order of tag/attribute markup

Filter
++++++

USFM has become a very broad specification. Every feature is probably used by someone, but few use every feature. The filter step can remove
features that are not needed, resulting in faster subsequent processing and reduced memory overheads.

Succinctifier
+++++++++++++

The succinctifier takes the somewhat memory-hungry output of previous steps and packages it in a succinct format. The key technologies are

- byte arrays
- a variable-length representation of integer offset "pointers" that may only use one byte and will never use more than 3 bytes
- enums for all text content, at the doc set level (ie the enums are shared by all documents in a collection).

Store
+++++

The succinct representation can be serialised and loaded much more quickly than USFM.

GraphQL API
+++++++++++

Queries are expressed in `GraphQL <https://graphql.org/>`_. This format is extremely convenient for database-like queries.

Render Model
++++++++++++

Some use cases and queries will return text with rich markup. This can prove challenging to process, especially in technologies such as
`React <https://reactjs.org/>`_ which require well-formed JSX rather than "one tag at a time". The optional rendering model consumes
the result of a GraphQL query and offers an event-driven processing model.