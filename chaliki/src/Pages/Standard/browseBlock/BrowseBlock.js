import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import styles from '../../../global_styles';
import Container from "@material-ui/core/Container";
import DocSetPicker from "../../../sharedComponents/DocSetPicker";
import BookPicker from "../../../sharedComponents/BookPicker";
import InspectQuery from "../../../sharedComponents/InspectQuery";
import { renderVersesItems } from '../../../lib/render_items';

const BrowseBlock = withStyles(styles)((props) => {
    const {classes} = props;
    const [selectedDocSet, setSelectedDocSet] = React.useState(null);
    const [selectedBook, setSelectedBook] = React.useState(null);
    const [blockN, setBlockN] = React.useState(0);
    const [result, setResult] = React.useState({});
    const [query, setQuery] = React.useState('');
    const blockQueryTemplate =
        '{\n' +
        '  docSet(id:"%docSetId%") {\n' +
        '    document(bookCode: "%bookCode%") {\n' +
        '      title: header(id: "toc2")\n' +
        '      mainSequence {\n' +
        '         nBlocks\n' +
        '         blocks(positions:%blockN%) {\n' +
        '            bs { payload }\n' +
        '            items { type subType payload }\n' +
        '         }\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '}';

    React.useEffect(() => {
        const doQuery = async () => {
            if (selectedDocSet && selectedBook) {
                const browseQuery = blockQueryTemplate
                    .replace(/%docSetId%/g, selectedDocSet)
                    .replace(/%bookCode%/g, selectedBook)
                    .replace(/%blockN%/g, blockN)
                setQuery(browseQuery);
                const res = await props.pk.gqlQuery(browseQuery);
                setResult(res);
            }
        };
        doQuery();
    }, [
        selectedDocSet,
        selectedBook,
        blockN,
    ]);

    React.useEffect(() => {
        if (selectedDocSet) {
            setSelectedBook(
                props.app.docSets
                    .filter(ds => ds.id === selectedDocSet)[0]
                    .documents[0]
                    .bookCode
            );
            setBlockN(0);
        }
    }, [selectedDocSet]);

    return (
        <>
            <div className={classes.toolbarMargin}/>
            <Container className={classes.page}>
                <div>
                    <DocSetPicker
                        selectedDocSet={selectedDocSet}
                        setSelectedDocSet={setSelectedDocSet}
                        app={props.app}
                    />
                    {props.app.docSets && selectedDocSet ?
                        <BookPicker
                            selectedDocSet={selectedDocSet}
                            selectedBook={selectedBook}
                            setSelectedBook={setSelectedBook}
                            app={props.app}
                        /> :
                        <Typography variant="h5" display="inline" className={classes.requireInput}>Please Select a
                            DocSet</Typography>
                    }
                    <InspectQuery app={props.app} raw={props.raw} query={query}/>
                </div>
                {
                    result.data &&
                    <div>
                        <IconButton
                            disabled={blockN === 0}
                            onClick={() => setBlockN(blockN - 1)}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="body1" display="inline" className={classes.browseNavigationText}>
                            {`Paragraph ${blockN + 1} of ${result.data && result.data.docSet.document.mainSequence.nBlocks}`}
                        </Typography>
                        <IconButton
                            disabled={result.data && blockN === result.data.docSet.document.mainSequence.nBlocks - 1}
                            onClick={() => setBlockN(blockN + 1)}
                        >
                            <ArrowForwardIcon/>
                        </IconButton>
                    </div>
                }
                {
                    'data' in result && 'docSet' in result.data && 'document' in result.data.docSet && result.data.docSet.document ?
                        [...result.data.docSet.document.mainSequence.blocks.entries()].map(
                            b => <Typography key={b[0]} variant="body1" className={classes[`usfm_${b[1].bs.payload.split('/')[1]}`]}>
                                {
                                    renderVersesItems(
                                        b[1].items,
                                        true,
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

export default BrowseBlock;
