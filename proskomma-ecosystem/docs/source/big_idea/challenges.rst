.. _big-idea-challenges:

##############
The Challenges
##############

Why is USFM so popular?
=======================

`USFM <https://ubsicap.github.io/usfm/>`_ and its XML sibling `USX <https://ubsicap.github.io/usx/>`_ have become
the format of choice for Bible translation. There are several good reasons for this:

- USFM is a standardized dialect of Standard Formatting Markers (SFM) that have been used by many organizations for decades. (SFM itself was initially used mostly for dictionaries before people starting forcing Scripture into the format, and then the early SFM Bibles were often edited by the Shoebox editor designed for dictionaries, replacing shoeboxes full of dictionary cards).
- The backslash-based markup, reminiscent of a 1980s word processor, has proved to be easy for Bible translators to use - at least for the most common tasks - including those with limited previous experience with computers
- A rich technological ecosystem has been created around USFM, including editors such as `Paratext <https://paratext.org/>`_ and data stores such as `the Paratext Registry <https://paratext.org/support/registry/>`_ and `the Digital Bible Library <https://thedigitalbiblelibrary.org>`_
- USFM is now at the basis of many Bible translation training programs, and almost all Bible translation communities have local experts in this format

In addition, other formats such as `OSIS <http://crosswire.org/osis/>`_ have failed to replace USFM in the past. Given the number of translation projects now using USFM, and the close deadlines of projects such as `Vision 2025 <https://www.missionfrontiers.org/issue/article/bible-translation-as-we-approach-2025>`_, it seems likely that USFM will continue to be the translation format of choice for the foreseeable future.

Why is USFM so hard to process?
===============================

Evolving Needs
--------------

USFM was defined at a time when, typically, the only output format was the printed page. Each new edition was a major event, prepared by many people including typesetters and professional printers, over an extended period.

In 2020, Scripture is published in many different digital formats. Even printing has changed radically with the advent of desktop publishing and print on demand. Modern translation workflow encourages rapid, incremental publishing as part of the translation process. USFM was not designed with any of these needs in mind.

For example, in many digital applications, queries like *"What is in chapter 1?"* or *"Give me John 3:4-4:2"* are common and vital. Such queries are a non-issue for traditional typesetting, where a new chapter is just another item to render on a page (maybe implementing widow/orphan logic). To put it another way, the reader is the search engine for a book. Algorithmic chapter and verse selection is therefore hard in USFM. It becomes much harder once retrofitted features such as `\cp <https://ubsicap.github.io/usfm/chapters_verses/index.html#cp>`_ are added into the mix.

Getting Past the Markup
-----------------------

Backslash-based markup was quite common in 1980. Today many programmers meet it for the first time in USFM. Modern technologies such as XML and JSON are of no help. A character-based parser is required, and these remain hard to write - or at least to write well. The vagueness of parts of the USFM specifications does not help here. (See, for example, the notes on `whitespace <https://ubsicap.github.io/usfm/about/syntax.html#whitespace>`_.) Neither does implicit marker closing or the `workaround <https://ubsicap.github.io/usfm/characters/nesting.html>`_ required to avoid it.

The semantics of USFM can also be hard to unpick. For example, sometimes a `paragraph <https://ubsicap.github.io/usfm/paragraphs/index.html>`_ is literally a paragraph of canonical content, such as `\p <https://ubsicap.github.io/usfm/paragraphs/index.html#p>`_. Sometimes a paragraph is a `non-canonical heading <https://ubsicap.github.io/usfm/titles_headings/index.html#s>`_ (not to be confused with a `canonical heading <https://ubsicap.github.io/usfm/titles_headings/index.html#d>`_). Sometimes a paragraph is a `chapter <https://ubsicap.github.io/usfm/chapters_verses/index.html>`_ marker (not to be confused with a `published chapter <https://ubsicap.github.io/usfm/chapters_verses/index.html#cp>`_). Sometimes a paragraph is more like a processing instruction, such as `\cl <https://ubsicap.github.io/usfm/chapters_verses/index.html#cl>`_ which, in addition, can mean two different things depending where it is used.

Character-level markup is a similarly mixed bag, including inline `footnotes <https://ubsicap.github.io/usfm/notes_basic/fnotes.html>`_ and `cross-references <https://ubsicap.github.io/usfm/notes_basic/xrefs.html>`_. Inline hypertext in itself is not unusual - it's a feature of many `W3C <https://www.w3.org/>`_ standards. Such features become more challenging in USFM because of Bible BCV (see below).

USFM 2 includes introductions, which use tags with different names that are often equivalent to tags used elsewhere. USFM 3 introduced an optional "end introduction" marker (which, in practical terms, is useless since that marker may or may not appear in any particular valid USFM 3 document). Features such as sidebars have been shoehorned into the existing structure, and it seems like every type of peripheral content is now delimited a different way.

Chapter and Verse
-----------------

Modern translations are structured in terms of semantically meaningful divisions such as sections, paragraphs and sentences. However, the vast majority of Christians and church traditions expect content to be rendered in terms of **Book, Chapter, Verse** (BCV). There are myriad variations on the details of BCV across traditions and languages and, in many cases, those divisions cut across the more modern structure hierarchy. It is therefore decidedly non-trivial to find the text within a BCV range while preserving other features of the translation, all in a format as familiar to younger programmers as data storage on audio cassettes.

Partial Solutions
=================

USFM obviously gets processed, a lot. But, because of the challenges involved, solutions tend to be partial and fragile. The easy things get done quickly, progress beyond a certain point becomes exponentially harder, and at some point progress stops because the result is "good enough", at least with the limited range of texts that need to be processed. The resulting code is fragile, especially when confronted with texts that use a different subset of USFM features, and at this point the easiest thing is to start writing a different, partial, fragile solution for the new use case.

The difficulty of processing USFM therefore ends up creating a barrier to using Scripture in modern media. It is very hard to spin this as A Good Thing.

USX
---

`USX <https://ubsicap.github.io/usx/>`_ is the XML expression of USFM. It has advantages over USFM, including

- processing using standard XML tools

- a formal schema for validating USX documents

- explicit, XML representation of the implicit markup-termination rules of USFM

However,

- USX does not address any of the deeper semantic issues inherited from USFM. It cannot address them without breaking roundtripability with USFM.

- USX is not suitable for editing by hand, and cannot therefore be exposed to the end user in an editor.

- In the XML world, there can be no such thing as "invalid USX". If something doesn't validate according to the schema, it isn't USX. This may be because of one misused tag, or because the "invalid USX" is actually some completely unrelated XML vocabulary such as an SVG illustration. This is a problem if less-than-perfect translation projects need to be serialized.

- The flat structure of USX proves challenging to process using standard XML tools. (A paper presented at `XML Prague 2011 <https://www.youtube.com/watch?v=7s_y4rPv5MY>`_ explored some of these challenges with respect to XSLT.)

- USX has some design quirks that appear to have been driven by conciseness rather than convenient parsing. For example, published chapter number can be `an attribute <https://ubsicap.github.io/usx/elements.html#chapter>`_ or `character markup <https://ubsicap.github.io/usx/elements.html#char>`_.

USFM/USX v3
-----------

v3 of USFM includes many extensions. Some of these, such as `chapter and verse milestones <https://ubsicap.github.io/usx/elements.html#chapter>`_ are intended to address the *"What is in chapter 1?"* above. Others add support for new features such as `extended study content <https://ubsicap.github.io/usfm/notes_study/index.html>`_.

Unfortunately, the addition of chapter/verse milestones makes USX generation much harder, and makes manual editing of USX almost impossible. This is because chapter/verse information has been denormalized into multiple locations that must be maintained in parallel. None of this helps with "published chapter/verse" markup. In addition, the precise tag order for these milestones is under-defined so, in practice, the way Paratext does it becomes the *de facto* standard.

In addition, some USFM 3 features look more like Paratext-specific features. See, for example, the `@srcloc word alignment feature <https://ubsicap.github.io/usx/charstyles.html#usx-charstyle-w>`_ which does not map onto the word alignment of many major Bible translation ecosystems.

Towards a Generic Solution
==========================

+---------------------------------------------------------------------------------------------------------------------+
| **Easy things should be easy, and hard things should be possible.**                                                 |
|                                                                                                                     |
| *Larry Wall*                                                                                                        |
|                                                                                                                     |
| Creator of Perl and one-time Bible translation intern                                                               |
+---------------------------------------------------------------------------------------------------------------------+

It follows from the description above that a number of approaches are not viable:

- USFM is very unlikely to be replaced as a translation format because it is widely used, and because previous attempts to replace it have been expensive failures.

- Attempts to "fix" USFM/USX through extensions may address some specific pain points, but at the cost of making the overall processing model more and more byzantine.

- Simplifying USFM would be very hard because, while almost no-one uses every single feature, every feature is used by someone.

Proskomma assumes that ranking texts will continue to be stored in USFM or USX. It attempts to provide an explicit processing model that

- represents USFM concepts using a small number of consistent building blocks

- addresses some of the semantic pain points

- is flexible enough to handle a range of use cases.

.. note::
   One consequence of this approach is that USFM is unlikely to be fully roundtripable. It should be possible to export USFM from Proskomma, but that USFM may not be a character-for-character match with the imported USFM.