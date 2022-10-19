import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {createEditor} from 'slate';
import {Editable, Slate, withReact} from 'slate-react';
import Button from "@material-ui/core/Button";
import InspectQuery from '../../../sharedComponents/InspectQuery';
import styles from '../../../global_styles';
import {
  items2slate,
  slate2items,
  SpanElement,
  SpanWithAttsElement,
  ChapterElement,
  VersesElement,
  TokensLeaf
} from "./slateUtils";

const EditBlock = withStyles(styles)((props) => {
  const {classes} = props;
  const [result, setResult] = React.useState({});
  const [query, setQuery] = React.useState('');
  const [blockNo, setBlockNo] = React.useState(0);
  const [nBlocks, setNBlocks] = React.useState(0);
  const [editsUnsaved, setEditsUnsaved] = React.useState(false);
  const [toClose, setToClose] = React.useState({chapter: null, verses: null});
  const [editorContent, setEditorContent] = React.useState([
    {
      type: 'block',
      children: [{text: 'Loading...'}],
    },
  ]);
  const [changeNo, setChangeNo] = React.useState(0);
  const blocksQueryTemplate =
    '{\n' +
    '  docSet(id:"%docSetId%") {\n' +
    '    document(bookCode: "%bookCode%") {\n' +
    '      title: header(id: "toc2")\n' +
    '      mainSequence {\n' +
    '        nBlocks\n' +
    '        blocks(positions: [%blockNo%]) { items { type subType payload } }\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}';

  const renderElement = React.useCallback((props) => {
    if (props.element.type === 'block') {
      return <p {...props.attributes}>{props.children}</p>;
    }
    if (props.element.type === 'markup') {
      if (props.element.atts) {
        return <span
            {...props.attributes}
            className={classes.editorMarkup}
            data-atts={props.element.atts.map(att => att.join('/')).join(' ')}
            onClick={(e) => console.log(e.target.getAttribute('data-atts'))}
        >
        {props.element.elementText}{props.children}
      </span>
      } else {
        return <span
            {...props.attributes}
            className={classes.editorMarkup}
        >
        {props.element.elementText}{props.children}
      </span>
      }
    }
    if (props.element.type.startsWith('span/')) {
      return <SpanElement {...props} />;
    }
    if (props.element.type.startsWith('spanWithAtts/')) {
      return <SpanWithAttsElement {...props} />;
    }
    if (props.element.type === 'chapter') {
      return <ChapterElement {...props} />;
    }
    if (props.element.type === 'verses') {
      return <VersesElement {...props} />;
    }
  }, []);

  const renderLeaf = React.useCallback(
      (props) => <TokensLeaf {...props} />,
      []
  );

  const slateEditor = React.useMemo(() => withReact(createEditor()), []);
  slateEditor.isInline = (element) => element.type !== 'block';
  slateEditor.isVoid = (element) =>
    ['chapter', 'verses', 'markup'].includes(element.type);

  React.useEffect(() => {
    const doQuery = async () => {
      if (props.selectedBook) {
        const editQuery = blocksQueryTemplate
          .replace(/%docSetId%/g, props.selectedDocSet)
          .replace(/%bookCode%/g, props.selectedBook || 'GEN')
          .replace(/%blockNo%/g, blockNo.toString());
        setQuery(editQuery);
        const res = await props.pk.gqlQuery(editQuery);
        setResult(res);
        const [items, closeCV] = items2slate(res.data.docSet.document.mainSequence.blocks[0].items);
        setEditorContent(items);
        setToClose(closeCV);
        setNBlocks(res.data.docSet.document.mainSequence.nBlocks);
      }
    };
    doQuery();
  }, [
    props.selectedDocSet,
    props.selectedBook,
    blockNo,
    changeNo,
  ]);

  const submitBlock = async () => {
    const items = slate2items(editorContent, toClose);
    const object2Query = obs => '[' + obs.map(ob => `{type: "${ob.type}" subType: "${ob.subType}" payload: "${ob.payload}"}`).join(', ') + ']';
    let query = `mutation { updateItems(` +
      `docSetId: "${props.selectedDocSet}"` +
      ` documentId: "${props.selectedDocument}"` +
      ` blockPosition: ${blockNo}` +
      ` items: ${object2Query(items)}) }`;
    const res = await props.pk.gqlQuery(query);
    console.log(res);
    setChangeNo(changeNo + 1);
  }

  if (result.data && result.data.docSet && editorContent.length > 0) {
    const title = (
      <div>
        <IconButton
          disabled={blockNo === 0}
          onClick={() => setBlockNo(blockNo - 1)}
        >
          <ArrowBackIcon/>
        </IconButton>
        <Typography
          variant="body1"
          display="inline"
          className={classes.browseNavigationText}
        >
          {`Paragraph ${blockNo + 1} of ${nBlocks}`}
          <InspectQuery app={props.app} raw={props.raw} query={query}/>
        </Typography>
        <IconButton
          disabled={blockNo === nBlocks - 1}
          onClick={() => setBlockNo(blockNo + 1)}
        >
          <ArrowForwardIcon/>
        </IconButton>
      </div>
    );
    return (
      <>
        {title}
        <Slate
          editor={slateEditor}
          value={editorContent}
          onChange={(newValue) => {
            setEditsUnsaved(true);
            // console.log(JSON.stringify(newValue, null, 2));
            setEditorContent(newValue);
          }}
        >
          <Editable renderElement={renderElement} renderLeaf={renderLeaf}/>
        </Slate>
        <div>
          <Button
            className={classes.cancelBlockEditButton}
            disabled={!editsUnsaved}
            variant="outlined"
            size="small"
            onClick={() => {
              setEditorContent(
                items2slate(result.data.docSet.document.mainSequence.blocks[0].items)[0]
              );
              setEditsUnsaved(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className={classes.submitBlockEditButton}
            disabled={!editsUnsaved}
            variant="contained"
            color="primary"
            size="small"
            onClick={submitBlock}
          >
            Submit
          </Button>
        </div>
      </>
    );
  }
  return <Typography variant="body1">Select a Book</Typography>;
});

export default EditBlock;
