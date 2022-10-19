import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import styles from '../../../global_styles';
import ChapterNavigation from '../../../sharedComponents/ChapterNavigation';
import VerseNavigation from '../../../sharedComponents/VerseNavigation';
import BookPicker from '../../../sharedComponents/BookPicker';
import InspectQuery from '../../../sharedComponents/InspectQuery';
import AlignedToken from './AlignedToken';
import Container from "@material-ui/core/Container";

const Alignment = withStyles(styles)((props) => {
    const {classes} = props;
    const [query, setQuery] = React.useState('');
    const [selectedBook, setSelectedBook] = React.useState('RUT');
    const [selectedChapter, setSelectedChapter] = React.useState(1);
    const [selectedVerse, setSelectedVerse] = React.useState(1);
    const [result, setResult] = React.useState({});
    const [lemma, setLemma] = React.useState('');

    const renderTokens = tokens => tokens.map(
        t => <AlignedToken token={t} lemma={lemma} setLemma={setLemma}/>
    );

    const alignmentQueryTemplate = `{
  ust: docSet(id: "unfoldingWord/en_ust") {
    document(bookCode:"%bookCode%") {
      cv(
        chapter:"%chapter%"
        verses:"%verse%"
        includeContext: true
        ) {
        tokens {payload scopes}
      }
    }
    documents {
      id
      bookCode: header(id: "bookCode")
      title: header(id: "toc2")
    }
  }
  ult: docSet(id:"unfoldingWord/en_ult") {
    document(bookCode:"%bookCode%") {
      cv(
        chapter:"%chapter%"
        verses:"%verse%"
        includeContext: true
        ) {
        tokens {payload scopes}
      }
    }
  }
  uhb: docSet(id:"unfoldingWord/hbo_uhb") {
    document(bookCode:"%bookCode%") {
      cv(
        chapter:"%chapter%"
        verses:"%verse%"
        includeContext: true
        ) {
        tokens {payload scopes}
      }
      nav: cvNavigation(
        chapter: "%chapter%"
        verse: "%verse%"
        ) {
        previousChapter
        previousVerse { chapter verse }
        nextVerse { chapter verse }
        nextChapter
      }
    }
  }
}`;
    React.useEffect(() => {
        const doQuery = async () => {
            const alignmentQuery = alignmentQueryTemplate
                .replace(/%bookCode%/g, selectedBook || '')
                .replace(/%chapter%/g, selectedChapter)
                .replace(/%verse%/g, selectedVerse);
            const res = await props.pk.gqlQuery(alignmentQuery);
            setQuery(alignmentQuery); // For InspectQuery
            setResult(res);
            if (res.data) {
                if (!selectedBook) {
                    setSelectedBook(res.data.ust.documents[0].bookCode);
                }
            }
        };
        doQuery();
    }, [
        selectedBook,
        selectedChapter,
        selectedVerse,
    ]);
    return result.data && result.data.uhb && result.data.uhb.document ? (
        <>
            <div className={classes.toolbarMargin}/>
            <Container className={classes.page}>
                <BookPicker
                    selectedDocSet="unfoldingWord/hbo_uhb"
                    selectedBook={selectedBook}
                    setSelectedBook={setSelectedBook}
                    setSelectedChapter={setSelectedChapter}
                    setSelectedVerse={setSelectedVerse}
                    app={props.app}
                />
                <InspectQuery app={props.app} raw={props.raw} query={query}/>
                <div>
                    <ChapterNavigation
                        setSelectedChapter={setSelectedChapter}
                        setSelectedVerse={setSelectedVerse}
                        direction="previous"
                        destination={result.data.uhb.document.nav.previousChapter}
                    />
                    <VerseNavigation
                        setSelectedChapter={setSelectedChapter}
                        setSelectedVerse={setSelectedVerse}
                        direction="previous"
                        destination={result.data.uhb.document.nav.previousVerse}
                    />
                    <Typography variant="body1" display="inline" className={classes.browseNavigationText}>
                        {`${selectedChapter || '-'}:${selectedVerse || '-'}`}
                    </Typography>
                    <VerseNavigation
                        setSelectedChapter={setSelectedChapter}
                        setSelectedVerse={setSelectedVerse}
                        direction="next"
                        destination={result.data.uhb.document.nav.nextVerse}
                    />
                    <ChapterNavigation
                        setSelectedChapter={setSelectedChapter}
                        setSelectedVerse={setSelectedVerse}
                        direction="next"
                        destination={result.data.uhb.document.nav.nextChapter}
                    />
                </div>
                <Grid container spacing={4} className={classes.grid}>
                    <Grid item xs="4" className={classes.gridItem}>
                        <Typography variant="h6">ULT</Typography>
                    </Grid>
                    <Grid item xs="4" className={classes.gridItem}>
                        <Typography variant="h6">UHB</Typography>
                    </Grid>
                    <Grid item xs="4" className={classes.gridItem}>
                        <Typography variant="h6">UST</Typography>
                    </Grid>
                    <Grid item xs="4" className={classes.gridItem}>
                        <Typography variant="body1">
                            {result.data.ult.document.cv.length > 0
                                ? renderTokens(result.data.ult.document.cv[0].tokens)
                                : 'No text found'}
                        </Typography>
                    </Grid>
                    <Grid item xs="4" className={classes.gridItem}>
                        <Typography variant="body1">
                            {result.data.uhb.document.cv.length > 0
                                ? renderTokens(result.data.uhb.document.cv[0].tokens)
                                : 'No text found'}
                        </Typography>
                    </Grid>
                    <Grid item xs="4" className={classes.gridItem}>
                        <Typography variant="body1">
                            {result.data.ust.document.cv.length > 0
                                ? renderTokens(result.data.ust.document.cv[0].tokens)
                                : 'No text found'}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography variant="body1"><b>Note: Not all OT books have alignment information</b></Typography>
            </Container>
        </>
    ) : (
        `${JSON.stringify(result.data, null, 2)}`
    );
});

export default Alignment;
