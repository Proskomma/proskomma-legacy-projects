import fse from 'fs-extra';
import { ScriptureDocSet } from 'proskomma-render';

export default class EditorHtmlDocSetModel extends ScriptureDocSet {

    constructor(result, context, config) {
        super(result, context, config);
        this.addActions();
    }

    addActions() {}

};
