import { UWProskomma } from 'uw-proskomma';
import { ScriptureParaModelQuery, ScriptureParaModel } from 'proskomma-render';
import { nt_uw_4book } from 'proskomma-frozen-archives';
import { thaw } from 'proskomma-freeze';
import EditorHtmlDocSetModel from '../EditorHtmlDocSetModel.js';
import EditorHtmlDocumentModel from '../EditorHtmlDocumentModel.js';

const docSetId = "xyz-eng_ult";
const bookCode = "LUK";

// Load docSet into Proskomma
const pk = new UWProskomma();
await thaw(pk, nt_uw_4book);

// Get ids
const contentResult = await pk.gqlQuerySync(`
{
  docSet(id:"${docSetId}") {
    id
    documents {
      bookCode: header(id: "bookCode")
      id
      mainSequence { id }
    }
  }
}`);
const doc = contentResult.data.docSet.documents.filter(d => d.bookCode === bookCode)[0];

// Produce Kitchen Sink JSON
const toRender = await ScriptureParaModelQuery(pk, [docSetId], [doc.id]);

const config = {
    docSetId,
    docId: doc.id,
    sequenceId: doc.mainSequence.id,
    supportedBlockTags: ['b', 'd', 'm', 'mr', 'ms', 'ms2', 'p', 'pc', 'pi', 'q', 'q2', 'q3', 'q4', 'qa', 'r', 's'],
    headingBlockTags: ['d', 'mr', 'ms', 'ms2', 'r', 's'],
    supportedSpans: ['wj', 'it', 'qs', 'bd', 'sc', 'sls'],
};
const processingModel = new ScriptureParaModel(toRender, config);
const docSetModel = new EditorHtmlDocSetModel(toRender, processingModel.context, config);
const documentModel = new EditorHtmlDocumentModel(docSetModel.result, docSetModel.context, docSetModel.config);
docSetModel.addDocumentModel('default', documentModel);
processingModel.addDocSetModel('default', docSetModel);

processingModel.render();
