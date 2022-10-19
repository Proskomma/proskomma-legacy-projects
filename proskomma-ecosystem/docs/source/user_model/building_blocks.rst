.. _user-model-building:

###############
Building Blocks
###############

.. image:: ./content_model.svg
   :alt: Proskomma v1.0 content model

Proskomma query results use nesting elements to represent the structure of a document. Together, these elements constitute the user model,
but do not map directly on to Proskomma internals. So, eg, there is no object, internally, that directly corresponds to a block.

DocSet
======

A docSet is a collection of documents. DocSets may be used to represent something similar to a Digital Bible Library bundle or a Paratext
project. The boundaries of collections are defined globally, at processor instantiation, using selectors.

Selectors
---------

Selectors, together, form a composite, primary key for a collection. A new document that has the same set of selectors as an existing
docSet will be added to that docSet. A new document that has a set of selectors that matches no existing docSet will be added to a
newly-created docSet. Each selector may be a string or a number, and the range of values may be constrained in various ways:

- for numbers, minimum and/or maximum value
- for strings, regex match
- for numbers and strings, enum membership

The default selectors are

- lang (a string representing the language code of the docSet)
- abbr (a string abbreviation for the docSet)

Tags
----

Tags may be assigned to each docSet. A tag is a string, optionally preceded by a qname-like prefix and a colon. The latter format
is intended to support key/value semantics.

Document
========

A document belongs to exactly one docSet. It contains headers, plus one or more sequence. Documents may be tagged in a similar way to
docSets.

Document Headers
----------------

For scripture content, these correspond to the `identification section of the USFM spec <https://ubsicap.github.io/usfm/identification/index.html>`_. The value for each header is a string, ie these values are not tokenized.

Sequence
========

A sequence is one continuous piece of text content. Each document has exactly one main sequence and zero or more other sequences which are linked,
directly or indirectly, to the main sequence by grafts. For scripture, the main sequence contains the canonical text of one book of the Bible.

Block
=====

A block is the "natural" way to break up the content of a sequence. It corresponds roughly to a USFM paragraph (although some USFM paragraphs
are treated as grafts). Proskomma is optimized to process blocks efficiently.

Each block has exactly one block scope, which is typically the paragraph marker in USFM or USX. Each block contains one or more item.

ItemGroup
=========

An itemGroup is an alternative way to break up the content of a sequence. Instead of dividing up items by block, the items are split on the basis of one or more scopes. The most obvious application is breaking up a text by chapter and verse, but this mechanism can be used with any combination of scopes.

.. note::
   ItemGroups are relatively expensive to generate compared to blocks, but may still be more efficient if, say, subsequent processing requires a lot of direct access by chapter/verse. This feature may be replaced in the future by the ability to import a document and store it natively with the alternative structure.

Item
====

There are three types of items:

- token
- scope
- graft

Token
-----

A token is a fragment of text. It may be classified as

- wordLike
- whitespace
- punctuation

Scope
-----

Scopes are used to represent markup around text, including

- character-level styles
- milestones
- word-level styles
- attributes

Each scope item either starts or ends a scope. The scope label consists of one or more steps separated by a slash
character, eg

- chapter/1
- verse/2
- attribute/milestone/zaln/x-strongs/0/G1234

Graft
-----

Grafts link together sequences to form a tree, with the main sequence at the root. Types of graft include

- headings
- remarks
- introductions
- side bars
- footnotes
