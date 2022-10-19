import {withStyles} from "@material-ui/core/styles";
import React from "react";
import xre from 'xregexp';

import styles from "../../../global_styles";

const items2slate = (items) => {  // Ignoring grafts, spanWithAtts, milestones and attributes
    const ret = [[]];
    const spans = [];
    let atts = [];
    const closeCV = {
        chapter: null,
        verses: null,
    };
    let tokenPayloads = [];
    const maybePushTokens = () => {
        if (tokenPayloads.length > 0) {
            ret[0].push({
                type: 'tokens',
                text: tokenPayloads.join('').replace(/\s+/g, ' '),
            });
            tokenPayloads = [];
        }
    };

    for (const item of items) {
        switch (item.type) {
            case 'token':
                tokenPayloads.push(item.payload);
                break;
            case 'scope':
                maybePushTokens();
                const scopeBits = item.payload.split('/');
                if (item.subType === 'start') {
                    if (['chapter', 'verses'].includes(scopeBits[0])) {
                        closeCV[scopeBits[0]] = null;
                        ret[0].push({
                            type: scopeBits[0],
                            elementText: scopeBits[1],
                            children: [
                                {
                                    text: '',
                                },
                            ],
                        });
                    } else if (scopeBits[0] === 'span') {
                        ret.unshift([]);
                        spans.unshift(scopeBits[1]);
                    } else if (scopeBits[0] === 'spanWithAtts') {
                        ret.unshift([]);
                        spans.unshift(scopeBits[1]);
                        atts = [];
                    } else if (scopeBits[0] === 'attribute') {
                        atts.push(scopeBits.slice(3));
                    }
                } else {
                    // end
                    if (['chapter', 'verses'].includes(scopeBits[0])) {
                        closeCV[scopeBits[0]] = scopeBits[1];
                    } else if (scopeBits[0] === 'span') {
                        const topStack = ret.shift();
                        const topTag = spans.shift();
                        ret[0].push(
                            {
                                text: '',
                            },
                            {
                                type: `span/${topTag}`,
                                children: [
                                    {
                                        type: 'markup',
                                        elementText: `${topTag}<`,
                                        children: [
                                            {
                                                text: "",
                                            },
                                        ]
                                    },
                                    ...topStack,
                                    {
                                        text: '',
                                    },
                                ],
                            },
                            {
                                type: 'markup',
                                elementText: '>',
                                children: [
                                    {
                                        text: '',
                                    },
                                ],
                            }
                        );
                    } else if (scopeBits[0] === 'spanWithAtts') {
                        const topStack = ret.shift();
                        const topTag = spans.shift();
                        ret[0].push(
                            {
                                text: '',
                            },
                            {
                                type: `spanWithAtts/${topTag}`,
                                children: [
                                    {
                                        type: 'markup',
                                        elementText: `${topTag}[${atts.length}]<`,
                                        atts: atts,
                                        children: [
                                            {
                                                text: "",
                                            },
                                        ]
                                    },
                                    ...topStack,
                                    {
                                        text: '',
                                    },
                                ],
                            },
                            {
                                type: 'markup',
                                elementText: '>',
                                children: [
                                    {
                                        text: '',
                                    },
                                ],
                            }
                        );
                        atts = [];
                    }
                }
                break;
            default:
                break;
        }
    }
    maybePushTokens();
    return [
        [
            {
                type: 'block',
                children: [
                    {
                        text: '',
                    },
                    ...ret[0],
                    {
                        text: '',
                    },
                ],
            },
        ],
        closeCV
    ];
};

const slate2items = (slate, toClose) => {
    const ret = [];
    let verses = null;
    const printableRegexes = [ // Missing some obscure options!
        ['wordLike', xre('([\\p{Letter}\\p{Number}\\p{Mark}\\u2060]{1,127})')],
        ['lineSpace', xre('([\\p{Separator}]{1,127})')],
        ['punctuation', xre('([\\p{Punctuation}+®])')],
    ];
    const allPrintableRegexes = xre.union(printableRegexes.map(rr => rr[1]));
    const isEmptyString = (ob) => ob.text && ob.text === '';
    const numbersFromVerseRange = vr => {
        if (vr.includes('-')) {
            const [fromV, toV] = vr.split('-').map(v => parseInt(v));
            return Array.from(Array((toV - fromV) + 1).keys()).map(v => v + fromV);
        } else {
            return [parseInt(vr)];
        }
    }
    const openChapter = (ret, ch) => {
        ret.push({
            type: 'scope',
            subType: 'start',
            payload: `chapter/${ch}`
        });
    }
    const closeChapter = (ret, ch) => {
        ret.push({
            type: 'scope',
            subType: 'end',
            payload: `chapter/${ch}`
        });
    }
    const openVerseRange = (ret, vr) => {
        numbersFromVerseRange(vr).forEach(
            v => ret.push({
                type: 'scope',
                subType: 'start',
                payload: `verse/${v}`
            }),
        );
        ret.push({
            type: 'scope',
            subType: 'start',
            payload: `verses/${vr}`
        });
    }
    const closeVerseRange = (ret, vr) => {
        ret.push({
            type: 'scope',
            subType: 'end',
            payload: `verses/${vr}`
        });
        numbersFromVerseRange(vr).reverse().forEach(
            v => ret.push({
                type: 'scope',
                subType: 'end',
                payload: `verse/${v}`
            }),
        );
    }
    const processTokens = child => {
        xre.forEach(
            child.text,
            allPrintableRegexes,
            tText => {
                for (const [tType, tRegex] of printableRegexes) {
                    if (xre.match(tText, tRegex, 0, true)) {
                        ret.push({
                            type: 'token',
                            subType: tType,
                            payload: tText[0],
                        });
                        break;
                    }
                }
            }
        );
    }
    const processChapter = child => { // To do this properly we need to look at open scopes
        openChapter(ret, child.elementText);
    }
    const processVerses = child => {
        if (verses) {
            closeVerseRange(ret, verses)
        }
        verses = child.elementText;
        openVerseRange(ret, verses);
    }
    const processSpan = child => {
        ret.push(
            {
                type: "scope",
                subType: "start",
                payload: child.type,
            }
        );
        slate2items1(child.children.filter(c => !isEmptyString(c)));
        ret.push(
            {
                type: "scope",
                subType: "end",
                payload: child.type,
            }
        );
    }
    const slate2items1 = children => {
        for (const child of children) {
            if ('text' in child) {
                processTokens(child);
            } else if (child.type === 'chapter') {
                processChapter(child);
            } else if (child.type === 'verses') {
                processVerses(child);
            } else if (child.type.startsWith('span')) {
                processSpan(child);
            }
        }
    }
    slate2items1(slate[0].children.filter(c => !isEmptyString(c)));
    if (toClose.verses) {
        closeVerseRange(ret, toClose.verses);
    }
    if (toClose.chapter) {
        closeChapter(ret, toClose.chapter);
    }
    return ret;
}

const SpanElement = withStyles(styles)((props) => {
    const {classes} = props;
    const tag = props.element.type.split('/')[1];
    return (
        <span
            {...props.attributes}
            className={classes[`span${tag.toUpperCase()}Element`]}
        >
          {props.children}
      </span>
    );
});

const SpanWithAttsElement = withStyles(styles)((props) => {
    const {classes} = props;
    const tag = props.element.type.split('/')[1];
    return (
        <span
            {...props.attributes}
            className={classes[`spanWithAtts${tag.toUpperCase()}Element`]}
        >
          {props.children}
      </span>
    );
});

const ChapterElement = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <span {...props.attributes} className={classes.chapterElement}>
        {'Ch '}
            {props.element.elementText}
            {props.children}
      </span>
    );
});

const VersesElement = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <span {...props.attributes} className={classes.versesElement}>
        {'vv '}
            {props.element.elementText}
            {props.children}
      </span>
    );
});

const TokensLeaf = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <span {...props.attributes} className={classes[props.leaf.class || 'tokensLeaf']}>
        {props.children}
      </span>
    );
});

export {
    items2slate,
    slate2items,
    SpanElement,
    SpanWithAttsElement,
    ChapterElement,
    VersesElement,
    TokensLeaf
}