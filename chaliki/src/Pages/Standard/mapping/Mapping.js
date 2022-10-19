import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import styles from '../../../global_styles';
import ChapterNavigation from "../../../sharedComponents/ChapterNavigation";
import VerseNavigation from "../../../sharedComponents/VerseNavigation";
import BookPicker from "../../../sharedComponents/BookPicker";
import InspectQuery from "../../../sharedComponents/InspectQuery";
import Container from "@material-ui/core/Container";

const Mapping = withStyles(styles)((props) => {
    const {classes} = props;
    const [query, setQuery] = React.useState('');
    const [selectedBook, setSelectedBook] = React.useState('PSA');
    const [selectedChapter, setSelectedChapter] = React.useState(1);
    const [selectedVerse, setSelectedVerse] = React.useState(1);
    const [result, setResult] = React.useState({});
    const verseMappingQueryTemplate =
        `{
  unmapped: docSet(id: "dbl/en_drh") {
    document(bookCode:"%bookCode%") {
      drh: cv(
        chapter:"%chapter%"
        verses:"%verse%"
        ) {
        text
      }
    }
  }
  mapped: docSet(id:"ebible/en_web") {
    document(bookCode:"%bookCode%") {
      web: cv(
        chapter:"%chapter%"
        verses:"%verse%"
        ) {
        text
      }
      drh: mappedCv(
        mappedDocSetId:"dbl/en_drh"
        chapter:"%chapter%"
        verses:"%verse%"
        ) {
        text
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
            const verseMappingQuery =
                verseMappingQueryTemplate
                    .replace(/%bookCode%/g, selectedBook)
                    .replace(/%chapter%/g, selectedChapter)
                    .replace(/%verse%/g, selectedVerse);
            const res = await props.pk.gqlQuery(verseMappingQuery);
            setQuery(verseMappingQuery); // For InspectQuery
            setResult(res);
            if (res.data) {
                if (!selectedBook) {
                    setSelectedBook(res.data.mapped.documents[0].bookCode);
                }
            }
        };
        doQuery();
    }, [selectedBook, selectedChapter, selectedVerse]);
    return (
        result.data && result.data.mapped && result.data.mapped.document ?
            <>
                <div className={classes.toolbarMargin}/>
                <Container className={classes.page}>
                    <BookPicker
                        selectedDocSet="ebible/en_web"
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
                            destination={result.data.mapped.document.nav.previousChapter}
                        />
                        <VerseNavigation
                            setSelectedChapter={setSelectedChapter}
                            setSelectedVerse={setSelectedVerse}
                            direction="previous"
                            destination={result.data.mapped.document.nav.previousVerse}
                        />
                        <Typography variant="body1" display="inline" className={classes.browseNavigationText}>
                            {`${selectedChapter || '-'}:${selectedVerse || '-'}`}
                        </Typography>
                        <VerseNavigation
                            setSelectedChapter={setSelectedChapter}
                            setSelectedVerse={setSelectedVerse}
                            direction="next"
                            destination={result.data.mapped.document.nav.nextVerse}
                        />
                        <ChapterNavigation
                            setSelectedChapter={setSelectedChapter}
                            setSelectedVerse={setSelectedVerse}
                            direction="next"
                            destination={result.data.mapped.document.nav.nextChapter}
                        />
                    </div>
                    <Grid container spacing={4} className={classes.grid}>
                        <Grid item xs="4" className={classes.gridItem}>
                            <Typography variant="h6">World English Bible</Typography>
                        </Grid>
                        <Grid item xs="4" className={classes.gridItem}>
                            <Typography variant="h6">Douay Rheims, with Mapping</Typography>
                        </Grid>
                        <Grid item xs="4" className={classes.gridItem}>
                            <Typography variant="h6">Douay Rheims, without Mapping</Typography>
                        </Grid>
                        <Grid item xs="4" className={classes.gridItem}>
                            <Typography variant="body1">{
                                result.data.mapped.document.web.length > 0 ?
                                    result.data.mapped.document.web[0].text :
                                    'No text found'
                            }</Typography>
                        </Grid>
                        <Grid item xs="4" className={classes.gridItem}>
                            <Typography variant="body1">{
                                result.data.mapped.document.drh.length > 0 ?
                                    result.data.mapped.document.drh[0].text :
                                    'No text found'
                            }</Typography>
                        </Grid>
                        <Grid item xs="4" className={classes.gridItem}>
                            <Typography variant="body1">{
                                result.data.unmapped.document.drh.length > 0 ?
                                    result.data.unmapped.document.drh[0].text :
                                    'No text found'
                            }</Typography>
                        </Grid>
                    </Grid>
                </Container>
            </> : `${JSON.stringify(result.data)}`
    );
});

export default Mapping;
