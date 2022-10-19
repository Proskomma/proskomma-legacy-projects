import BrowseVerseBlocks from './BrowseVerseBlocks';

const conf = {
  url: "browseVerseBlocks",
  menuEntry: "Browse by Verse Paragraphs",
  pageTitle: "Browse by Verse Paragraphs",
  description: "View Scripture by Verse Paragraphs",
  pageClass: BrowseVerseBlocks,
  state: [
    ['selectedDocSet', null],
    ['selectedBook', null],
    ['selectedChapter', null],
    ['selectedVerse', null],
  ],
};

export default conf;
