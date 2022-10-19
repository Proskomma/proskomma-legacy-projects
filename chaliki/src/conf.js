import dataConf from './Pages/Standard/data/conf';
import browseVerseConf from './Pages/Standard/browseVerse/conf';
import browseVerseBlocksConf from './Pages/Standard/browseVerseBlocks/conf';
import browseChapterConf from './Pages/Standard/browseChapter/conf';
import browseBlockConf from './Pages/Standard/browseBlock/conf';
import searchConf from './Pages/Standard/search/conf';
import editConf from './Pages/Standard/edit/conf';
import alignmentConf from './Pages/Standard/alignment/conf';
import mappingConf from './Pages/Standard/mapping/conf';
import rawConf from './Pages/Standard/rawQuery/conf';
import aboutConf from './Pages/Standard/about/conf';

const pagesArray = [
    dataConf,
    browseVerseConf,
    browseVerseBlocksConf,
    browseChapterConf,
    browseBlockConf,
    searchConf,
    alignmentConf,
    editConf,
    mappingConf,
    rawConf,
    aboutConf,
];
let pages = {};
let stateSpec = {};
for (const page of pagesArray) {
    pages[page.url] = page;
    stateSpec[page.url] = page.state || [];
}

export {pagesArray, pages, stateSpec};
