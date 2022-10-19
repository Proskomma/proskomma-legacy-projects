import React from 'react';

import {withStyles} from '@material-ui/core/styles';

import styles from '../../../global_styles';
import BookPicker from '../../../sharedComponents/BookPicker';
import Container from "@material-ui/core/Container";
import DocSetPicker from "../../../sharedComponents/DocSetPicker";
import EditBlock from './EditBlock';

const Edit = withStyles(styles)((props) => {
    const {classes} = props;
    const [selectedDocSet, setSelectedDocSet] = React.useState(null);
    const [selectedBook, setSelectedBook] = React.useState(null);
    const [result, setResult] = React.useState({});
    const browseQueryTemplate =
        '{\n' +
        '  docSet(id:"%docSetId%") {\n' +
        '    selectors { key value }\n' +
        '    documents {\n' +
        '      id\n' +
        '      bookCode: header(id: "bookCode" )\n' +
        '      title: header(id: "toc2")\n' +
        '    }' +
        '  }' +
        '}';
    React.useEffect(() => {
        const doQuery = async () => {
            const browseQuery = browseQueryTemplate.replace(
                /%docSetId%/g,
                selectedDocSet || ''
            );
            const res = await props.pk.gqlQuery(browseQuery);
            setResult(res);
        };
        doQuery();
    }, [selectedDocSet, selectedBook]);
    const ds = !result.data || !result.data.docSet ? {} : result.data.docSet;
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
                    {
                        (selectedDocSet && ds && ds.selectors) ?
                            <BookPicker
                                selectedDocSet={selectedDocSet}
                                selectedBook={selectedBook}
                                setSelectedBook={setSelectedBook}
                                app={props.app}
                            /> : ''
                    }
                </div>
                {
                    !selectedDocSet || !ds || !ds.selectors ? (
                        <div>Select a DocSet</div>
                    ) : (
                        <EditBlock
                            pk={props.pk}
                            app={props.app}
                            raw={props.raw}
                            selectedDocSet={selectedDocSet}
                            selectedBook={selectedBook}
                            selectedDocument={selectedBook && result.data.docSet.documents.filter(d => d.bookCode === selectedBook)[0].id}
                        />
                    )
                }
            </Container>
        </>
    )
});

export default Edit;
