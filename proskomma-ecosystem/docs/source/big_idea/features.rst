.. _big-idea-features:

##################
Proskomma Features
##################

USFM and USX Parsing
--------------------

Proskomma provides multiple lexers that perform the first step of document import. The USFM and USX lexers are intended to produce an identical internal representation of the document, which means that a single toolchain can handle the rest of the processing.

.. note:: One consequence of this is that some USX features are discarded during parsing. This is notably the case of *ref/@loc* which, in USX provides BCV references in a standard format. This information cannot sanely be maintained by a manual editor and, in any case, the information is not available in USFM. Rather than relying on one closed-source editor to generate this information, the Bible-publishing world needs a standard way to share reference parsing information.

Multiple Content Types
----------------------

Scripture has long been at the centre of other documents such as concordances, lexicons, commentaries and translation notes. Rather than shoehorning this content into USFM, Proskomma supports multiple document types, based on the same model, but with domain-specific markers. This approach facilitates processing across multiple content types.

Proskomma also supports multiple representations of the same input format. In particular, it is possible to represent Scripture per-paragraph (as USFM does) or per-chapter/verse (as many applications assume) or both. This delivers faster results and less tortured application code.

A Simple, Consistent API Model
------------------------------

USFM includes paragraph-level markup, character-level markup, word-level markup, milestones, attributes, chapters, verses... Proskomma represents all that using three building blocks:

- *tokens* (text)
- *scopes* (markup around a portion of text)
- *grafts* (something to potentially insert at a specific point in the text)

Grafts are used to split Scripture into *sequences*. The main sequence contains canonical Scripture. Introductions, title pages, headings, sidebars, footnotes, cross-references and other non-canonical data is placed in separate sequences, linked to the parent sequence. The advantage of this approach is that each sequence represents exactly one thing, that you never need to skip past text, and that it is easy to include related material explicitly when necessary.

Efficient Storage
-----------------

Modern computing favours tree representations such as XML and JSON. Such representations allow for convenient, flexible processing. However, they also tend to take up a lot of memory because of 64-bit pointers. In-memory XML often becomes between 10 and 20 times larger when represented as a DOM tree.

The Proskomma building blocks are tiny, which would result in lots of pointers and huge in-memory document sizes. Proskomma therefore makes extensive use of `succinct data structures <https://en.wikipedia.org/wiki/Succinct_data_structure>`_:

+---------------------------------------------------------------------------------------------+
| A succinct data structure is a data structure which uses an amount of space that is "close" |
|                                                                                             |
| to the information-theoretic lower bound, but (unlike other compressed representations)     |
|                                                                                             |
| still allows for efficient query operations... Unlike general lossless data compression     |
|                                                                                             |
| algorithms, succinct data structures retain the ability to use them in-place, without       |
|                                                                                             |
| decompressing them first.                                                                   |
+---------------------------------------------------------------------------------------------+

Flexible Queries
----------------

Proskomma uses `GraphQL <https://graphql.org/>`_ as the basis of its API. Queries may be tailored to provide just the information that is needed for any particular task, structured in a way that is convenient to process.