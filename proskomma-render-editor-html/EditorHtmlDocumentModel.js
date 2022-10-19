import {ScriptureParaDocument} from 'proskomma-render';
import * as htmlResources from './HtmlResources.js';

export default class EditorHtmlDocumentModel extends ScriptureParaDocument {

    constructor(result, context, config) {
        super(result, context, config);
        this.appData = {
            output: [],
            blockText: [],
        };
        this.addActions();
    }

    maybeOutputBlockText() {
        if (this.appData.blockText.length > 0) {
            this.appData.output.push(htmlResources.startTokens());
            this.appData.output.push(this.appData.blockText.join(''));
            this.appData.output.push(htmlResources.endTokens());
            this.appData.blockText = [];
        }
    }

    addActions() {

        this.addAction(
            'startSequence',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId,
            (renderer, context, data) => {
                // console.log('Start of sequence', context.sequenceStack[0].id);
                this.appData.output.push(htmlResources.startHtml({
                    title: `${data.type} Sequence`,
                    sequenceId: this.config.sequenceId,
                }))
            }
        );

        this.addAction(
            'startBlock',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId,
            (renderer, context, data) => {
                // console.log('Start of block');
                this.appData.output.push(htmlResources.startBlock({blockType: context.sequenceStack[0].block.blockScope.split('/')[1]}));
            }
        );

        this.addAction(
            'blockGraft',
            context => true,
            (renderer, context, data) => {
                if (context.sequenceStack[0].id === this.config.sequenceId) {
                    // console.log('  Block Graft', data.subType, data.payload)
                    this.appData.output.push(htmlResources.startBlockGraft({subType: data.subType, id: data.payload}));
                    this.appData.output.push(data.subType);
                    this.appData.output.push(htmlResources.endBlockGraft());
                }
                renderer.renderSequenceId(data.payload);
            }
        );

        this.addAction(
            'startItems',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId,
            (renderer, context, data) => {
                // console.log('  Start of block items');
                this.appData.output.push(htmlResources.startItems());
                this.appData.blockText = [];
            }
        );

        this.addAction(
            'inlineGraft',
            context => true,
            (renderer, context, data) => {
                if (context.sequenceStack[0].id === this.config.sequenceId) {
                    // console.log('  Inline Graft', data.subType, data.payload)
                    this.maybeOutputBlockText();
                    this.appData.output.push(htmlResources.startInlineGraft({subType: data.subType, id: data.payload}));
                    this.appData.output.push(data.subType);
                    this.appData.output.push(htmlResources.endInlineGraft());
                }
                renderer.renderSequenceId(data.payload);
            }
        );

        this.addAction(
            'token',
            context => (context, data) => context.sequenceStack[0].id === this.config.sequenceId, // Doesn't work!!!
            (renderer, context, data) => {
                if (context.sequenceStack[0].id === this.config.sequenceId) {
                    this.appData.blockText.push(["linespace", "eol"].includes(data.subType) ? " " : data.payload);
                }
            }
        );

        this.addAction(
            'scope',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId && data.subType === 'start' && data.payload.startsWith("chapter/"),
            (renderer, context, data) => {
                this.maybeOutputBlockText();
                this.appData.output.push(htmlResources.chapterNumber({c: data.payload.split('/')[1]}));
            }
        );

        this.addAction(
            'scope',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId && data.subType === 'start' && data.payload.startsWith("verses/"),
            (renderer, context, data) => {
                this.maybeOutputBlockText();
                this.appData.output.push(htmlResources.verseNumber({v: data.payload.split('/')[1]}));
            }
        );

        this.addAction(
            'scope',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId && data.subType === 'start' && data.payload.startsWith("span/"),
            (renderer, context, data) => {
                const spanType = data.payload.split('/')[1];
                if (!renderer.config.supportedSpans.includes(spanType)) {
                    console.log(`WARNING: unexpected character-level tag ${spanType}`);
                }
                this.maybeOutputBlockText();
                renderer.appData.output.push(htmlResources.startCharacterSpan({spanType}));
            }
        );

        this.addAction(
            'scope',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId && data.subType === 'end' && data.payload.startsWith("span/"),
            (renderer, context, data) => {
                this.maybeOutputBlockText();
                renderer.appData.output.push(htmlResources.endCharacterSpan());
            }
        );

        this.addAction(
            'endItems',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId,
            (renderer, context, data) => {
                // console.log('  End of block items');
                this.maybeOutputBlockText();
                this.appData.output.push(htmlResources.endItems());
            }
        );

        this.addAction(
            'endBlock',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId,
            (renderer, context, data) => {
                // console.log('End of block');
                this.appData.output.push(htmlResources.endBlock());
            }
        );

        this.addAction(
            'endSequence',
            (context, data) => context.sequenceStack[0].id === this.config.sequenceId,
            (renderer, context, data) => {
                // console.log('End of sequence', context.sequenceStack[0].id);
                this.appData.output.push(htmlResources.endHtml());
                console.log(this.appData.output.join(''));
            }
        );

    }

};
