import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import styles from '../../../global_styles';
import ChapterNavigation from '../../../sharedComponents/ChapterNavigation';
import Container from "@material-ui/core/Container";
import DocSetPicker from "../../../sharedComponents/DocSetPicker";
import BookPicker from "../../../sharedComponents/BookPicker";
import InspectQuery from "../../../sharedComponents/InspectQuery";
import {renderVersesItems} from '../../../lib/render_items';
import VerseNavigation from "../../../sharedComponents/VerseNavigation";
import BrowseModeButton from "../../../sharedComponents/BrowseModeButton";

const BrowseVerseBlocks = withStyles(styles)((props) => {
    const {classes} = props;
    const [result, setResult] = React.useState({});
    const [query, setQuery] = React.useState('');
    const chapterQueryTemplate =
        '{\n' +
        '  docSet(id:"%docSetId%") {\n' +
        '    document(bookCode: "%bookCode%") {\n' +
        '      title: header(id: "toc2")\n' +
        '      mainSequence {\n' +
        '         blocks(withScriptureCV: "%chapter%:%verse%") {\n' +
        '            bs { payload }\n' +
        '            items { type subType payload }\n' +
        '         }\n' +
        '      }\n' +
        '      nav: cvNavigation(chapter:"%chapter%" verse: "%verse%") {\n' +
        '        previousChapter\n' +
        '        nextChapter\n' +
        '        previousVerse { chapter verse }\n' +
        '        nextVerse { chapter verse }\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '}';

    React.useEffect(() => {
        const doQuery = async () => {
            if (props.browseVerseBlocks.selectedDocSet && props.browseVerseBlocks.selectedBook) {
                const browseQuery = chapterQueryTemplate
                    .replace(/%docSetId%/g, props.browseVerseBlocks.selectedDocSet)
                    .replace(/%bookCode%/g, props.browseVerseBlocks.selectedBook)
                    .replace(/%chapter%/g, props.browseVerseBlocks.selectedChapter)
                    .replace(/%verse%/g, props.browseVerseBlocks.selectedVerse)
                setQuery(browseQuery);
                const res = await props.pk.gqlQuery(browseQuery);
                console.log(JSON.stringify(res, null, 2));
                setResult(res);
            }
        };
        doQuery();
    }, [
        props.browseVerseBlocks.selectedDocSet,
        props.browseVerseBlocks.selectedBook,
        props.browseVerseBlocks.selectedChapter,
        props.browseVerseBlocks.selectedVerse,
    ]);

    React.useEffect(() => {
        if (props.browseVerseBlocks.selectedDocSet) {
            props.browseVerseBlocks.selectedBook || props.browseVerseBlocks.setSelectedBook(
                props.app.docSets
                    .filter(ds => ds.id === props.browseVerseBlocks.selectedDocSet)[0]
                    .documents[0]
                    .bookCode
            );
            props.browseVerseBlocks.selectedChapter || props.browseVerseBlocks.setSelectedChapter(1);
            props.browseVerseBlocks.selectedVerse || props.browseVerseBlocks.setSelectedVerse(1);
        }
    }, [props.browseVerseBlocks.selectedDocSet]);

    return (
        <>
            <div className={classes.toolbarMargin}/>
            <Container className={classes.page}>
                <div>
                    <DocSetPicker
                        selectedDocSet={props.browseVerseBlocks.selectedDocSet}
                        setSelectedDocSet={props.browseVerseBlocks.setSelectedDocSet}
                        app={props.app}
                    />
                    {props.app.docSets && props.browseVerseBlocks.selectedDocSet ?
                        <BookPicker
                            selectedDocSet={props.browseVerseBlocks.selectedDocSet}
                            selectedBook={props.browseVerseBlocks.selectedBook}
                            setSelectedBook={props.browseVerseBlocks.setSelectedBook}
                            setSelectedChapter={props.browseVerseBlocks.setSelectedChapter}
                            setSelectedVerse={props.browseVerseBlocks.setSelectedVerse}
                            app={props.app}
                        /> :
                        <Typography variant="h5" display="inline" className={classes.requireInput}>Please Select a
                            DocSet</Typography>
                    }
                    <InspectQuery app={props.app} raw={props.raw} query={query}/>
                    <BrowseModeButton
                        label="Browse Chapter"
                        url="browseChapter"
                        app={props.app}
                        targetState={props.browseChapter}
                        selectedDocSet={props.browseVerseBlocks.selectedDocSet}
                        selectedBook={props.browseVerseBlocks.selectedBook}
                        selectedChapter={props.browseVerseBlocks.selectedChapter}
                    />
                    <BrowseModeButton
                        label="Browse Verse"
                        url="browseVerse"
                        app={props.app}
                        targetState={props.browseVerse}
                        selectedDocSet={props.browseVerseBlocks.selectedDocSet}
                        selectedBook={props.browseVerseBlocks.selectedBook}
                        selectedChapter={props.browseVerseBlocks.selectedChapter}
                        selectedVerse={props.browseVerseBlocks.selectedVerse}
                    />
                </div>
                <div>
                    {
                        'data' in result && 'docSet' in result.data && 'document' in result.data.docSet && result.data.docSet.document ?
                            <>
                                <ChapterNavigation
                                    setSelectedChapter={props.browseVerseBlocks.setSelectedChapter}
                                    setSelectedVerse={props.browseVerseBlocks.setSelectedVerse}
                                    direction="previous"
                                    destination={result.data.docSet.document.nav.previousChapter}
                                />
                                <VerseNavigation
                                    setSelectedChapter={props.browseVerseBlocks.setSelectedChapter}
                                    setSelectedVerse={props.browseVerseBlocks.setSelectedVerse}
                                    direction="previous"
                                    destination={result.data.docSet.document.nav.previousVerse}
                                />
                            </> : ''
                    }
                    <Typography variant="body1" display="inline" className={classes.browseNavigationText}>
                        {`${props.browseVerseBlocks.selectedChapter || '-'}:${props.browseVerseBlocks.selectedVerse || '-'}`}
                    </Typography>
                    {
                        'data' in result && 'docSet' in result.data && 'document' in result.data.docSet && result.data.docSet.document ?
                            <>
                                <VerseNavigation
                                    setSelectedChapter={props.browseVerseBlocks.setSelectedChapter}
                                    setSelectedVerse={props.browseVerseBlocks.setSelectedVerse}
                                    direction="next"
                                    destination={result.data.docSet.document.nav.nextVerse}
                                />
                                <ChapterNavigation
                                    setSelectedChapter={props.browseVerseBlocks.setSelectedChapter}
                                    setSelectedVerse={props.browseVerseBlocks.setSelectedVerse}
                                    direction="next"
                                    destination={result.data.docSet.document.nav.nextChapter}
                                />
                            </> : ''
                    }
                </div>
                {
                    'data' in result && 'docSet' in result.data && 'document' in result.data.docSet && result.data.docSet.document ?
                        [...result.data.docSet.document.mainSequence.blocks.entries()].map(
                            b => <Typography key={b[0]} variant="body1"
                                             className={classes[`usfm_${b[1].bs.payload.split('/')[1]}`]}>
                                {
                                    renderVersesItems(
                                        b[1].items,
                                        false,
                                        props.browseVerseBlocks.selectedVerse,
                                        props.browseVerseBlocks,
                                        props.browseVerse,
                                        props.app,
                                    )
                                }
                            </Typography>
                        ) : (
                            <Typography variant="body1">No Results</Typography>
                        )
                }
            </Container>
        </>
    );
});

export default BrowseVerseBlocks;
