.. _under-hood-architecture_1_0:

#################
Architecture v1.0
#################

.. image:: ./v1_0_overview.svg
   :alt: Proskomma Block Architecture

Numbers in parentheses in the discussion below refer to the diagram above.

Core Processing: the DocSet API
===============================

The Proskomma core manipulates a model based on succinct JSON documents, grouped into docSets (1). These operations are generic, ie they can be performed for all document types. (The semantics of those operations may well differ between document types, but this does not affect
the byte-level operations.)

The Proskomma core does not itself store documents. Instead, it provides a transparent interface to...

Working memory: the Store
=========================

The store (2) contains local documents, and provides basic CRUD functionality for managing these documents. The core-facing API is standard, and hides the implementation of the store. The first implementation will use in-memory JSON structures. Each instance of Proskomma will use exactly one store. The store also uses an API provided by...

Persistence: the Archive
========================

The archive (3) offers some form of version control. The first implementation will use DCS/Git. An instance of Proskomma
may use one or more archive, on a docSet by docSet basis.

The Developer-Facing API: GraphQL
=================================

All interaction with Proskomma happens via GraphQL (4). Benefits include

- Type checking of inputs and outputs
- Flexible queries to avoid over and under-delivery of data
- Language-independent queries

Queries are submitted as strings. The result is returned as a JSON document. Content such as USFM and XML may
be represented as either an escaped string or a Base64 string (5).

"Read" queries (6) interact with the core docSet API, and may use exporters to return documents in external formats.

"Write" queries (7) - known as mutations in GraphQL - use generic operations. In simple cases, mutations may interact
directly with the docSet, but most mutations will use some or all of the...

Document Import Pipeline
========================

The import pipeline (8) performs a series of steps to convert input documents into a normalized Proskomma representation.
This process may be truncated for some modifications depending on the scope of the changes.

Lexers
------

Lexers (9) break down the input document into an array of tuples that are meaningful for subsequent processing. Thus, for example,
USFM and USX produce similar tuple arrays, but a lexer for another XML vocabulary might produce very different tuples to the USX lexer.

Parsers
-------

Parsers (10) convert a tuple array into a succinct JSON representation. The parser engine itself is generic, but relies heavily on
parsing information that forms part of the document spec (11).

Validators
----------

Validators (12) check that the succinct JSON is acceptable before further processing. "Valid" here means "good enough to be able to work with"
rather than "conforming perfectly to a specification or passing all checks".

Tidiers
-------

The format-aware tidier (13) performs any post-parsing tweaks that are difficult to achieve while performing tuple-by-tuple parsing. Reordering published
chapter and verse numbers is one example when processing USFM.

The generic tidier (14) normalizes the succinct JSON content, checking for things like empty scopes and blocks.

Filter
------

The filter (15) can be used to strip out unneeded content and markup, to reduce storage overheads and processing complexity. For example, a particular use case
may not use most text formatting, or may not use milestone/attribute-based markup.

Garbage collector
-----------------

Tidying and filtering may result in sequences that are no longer referenced, as well as references to sequences that no longer exist. The garbage collector (16) takes care of this. For example, if a reference to a footnote is deleted, the sequence containing the footnote content should probably
be deleted too.

Document Export
===============

This can be seen as the first part of the document import pipeline in reverse:

- an exporter (17) "unparses" the succinct JSON into an array of tuples
- a serializer (18) converts those tuples into the desired export format.

In a similar way to import, there is potentially a many-to-many relationship between exporters and serializers. For example, one Scripture exporter could
potentially feed into a USFM serializer or a USX serializer, and exporters for multiple document types could then be serialized as TSV.
