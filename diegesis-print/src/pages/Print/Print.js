import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {
    IonCol,
    IonContent,
    IonGrid,
    IonPage,
    IonRow,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
} from "@ionic/react";
import {printOutline} from "ionicons/icons";
import {doRender} from 'proskomma-render-pdf';
import PageHeader from "../../components/PageHeader";
import "./Print.css";

export default function Print({pkState, navState, setNavState, catalog}) {
    const [rendering, setRendering] = useState('false');
    const [bibleName, setBibleName] = useState('');
    const [bibleBooks, setBibleBooks] = useState([]);

    const disableRender = () => !catalog.docSets || bibleBooks.length === 0 || bibleName.trim().length === 0;

    useEffect(
        () => {
            const doLocalRender = async () => {
                const config = {
                    "bookOutput": {},
                    "title": bibleName.trim(),
                    "language": "en",
                    "textDirection": "ltr",
                    "uid": "ULT",
                    "bookSources": bibleBooks,
                    "peripheralSources": [],
                    "structure": [
                        [
                            "section",
                            "canonical",
                            bibleBooks.map(book => ["bookCode", book]),
                        ]
                    ],
                    "i18n": {
                        "notes": "Notes",
                        "tocBooks": "Content",
                        "titlePage": bibleName,
                        "copyright": "Licensed under a Creative Commons Attribution-Sharealike 4.0 International License",
                        "coverAlt": "Cover",
                        "preface": "Preface",
                        "ot": "Old Testament",
                        "nt": "New Testament",
                        "canonical": "Books of the Bible"
                    }
                };
                console.log("Start Render Query")
                const newPage = window.open();
                newPage.document.head.innerHTML = "<title>PDF Preview</title>";
                config.newPage = newPage;
                return await doRender(
                    pkState.proskomma,
                    config,
                    [navState.docSetId],
                    catalog.docSets
                        .filter(ds => ds.id === navState.docSetId)[0]?.documents
                        .filter(d => bibleBooks.includes(d.bookCode))
                        .map(d => d.id)
                );
            }
            if (!disableRender() && rendering) {
                doLocalRender()
                    .then(config2 => {
                            config2.newPage.document.body.innerHTML = config2.output.replace(/^[\s\S]*<body>/, "").replace(/<\/body>[\s\S]*/, "");
                            const script = document.createElement('script');
                            script.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
                            config2.newPage.document.head.appendChild(script);
                            const style = document.createElement('style');
                            style.innerHTML = config2.output.replace(/^[\s\S]*<style>/, "").replace(/<\/style>[\s\S]*/, "");
                            config2.newPage.document.head.appendChild(style);
                            setRendering(false);
                        }
                    )
            } else {
                setRendering(false);
            }
        },
        [bibleBooks, rendering]
    );

    return (
        <IonPage>
            <PageHeader
                title="Print Preview"
                navState={navState}
                setNavState={setNavState}
                catalog={catalog}
            />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size={12}>
                            <IonInput
                                class="fullWidthInput"
                                size={100}
                                color="secondary"
                                placeHolder="Title for Preview"
                                debounce={500}
                                onIonChange={
                                    e => {
                                        setBibleName(e.target.value);
                                    }
                                }
                                value={bibleName}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size={9}>
                            <IonItem>
                                <IonSelect
                                    placeHolder="Select Books to Render"
                                    value={bibleBooks}
                                    multiple={true}
                                    cancelText="Cancel"
                                    okText="Set"
                                    onIonChange={e => setBibleBooks(e.detail.value)}
                                    disabled={!catalog.docSets}
                                >
                                    {
                                        catalog.docSets && catalog.docSets
                                            .filter(ds => ds.id === navState.docSetId)[0]?.documents
                                            .map(
                                                doc => <IonSelectOption
                                                    key={doc.id}
                                                    value={doc.bookCode}
                                                    selected={bibleBooks.includes(doc.bookCode)}
                                                >
                                                    <IonLabel>{doc.bookCode}</IonLabel>
                                                </IonSelectOption>
                                            )
                                    }
                                </IonSelect>
                            </IonItem>
                        </IonCol>
                        <IonCol size={1}>
                            <IonButton
                                color="secondary"
                                size="small"
                                fill="outline"
                                onClick={
                                    () => {
                                        setBibleBooks(
                                            catalog.docSets
                                                .filter(ds => ds.id === navState.docSetId)[0]?.documents
                                                .map(doc => doc.bookCode)
                                        );
                                    }
                                }
                                disabled={!catalog.docSets}
                            >
                                All
                            </IonButton>
                        </IonCol>
                        <IonCol size={1}>
                            <IonButton
                                color="secondary"
                                fill="outline"
                                size="small"
                                class="ion-float-right"
                                onClick={() => {setBibleBooks([])}}
                                disabled={!catalog.docSets}
                            >
                                None
                            </IonButton>
                        </IonCol>
                        <IonCol size={1}>
                            <IonButton
                                color="primary"
                                fill="clear"
                                size="small"
                                class="ion-float-right"
                                onClick={() => {setRendering(true)}}
                                disabled={disableRender() || rendering}
                            >
                                <IonIcon icon={printOutline} />
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText>Select the version from the menu top left (which may be blank initially).</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText>Enter a print title for your Bible.</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText>Select books using the select or by clicking `all`.</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText>Click the print icon.</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText>The print preview should appear in a new browser tab.</IonText>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

Print.propTypes = {
    pkState: PropTypes.object.isRequired,
    navState: PropTypes.object.isRequired,
    setNavState: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired,
};
