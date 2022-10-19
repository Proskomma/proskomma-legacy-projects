import React, { useState, useEffect } from "react";
import { IonSelect, IonSelectOption } from "@ionic/react";
import PropTypes from "prop-types";

const VerseDropDown = ({ navState, setNavState, catalog }) => {
    const [verses, setVerses] = useState([]);
    useEffect(() => {
        if (catalog?.docSets) {
            const bible = catalog.docSets.find((bible) => bible.id === navState.docSetId);
            if (bible?.documents) {
                const book = bible?.documents.find((book) => book.bookCode === navState.bookCode);
                if (book?.cvNumbers) {
                    const chapter = book?.cvNumbers.find((c) => c.chapter === navState.chapter);
                    const _verses = chapter?.verses.map((item) => item.number) ?? [];
                    setVerses(_verses);
                    //if invalid verse ie verse not in verse list set to 1
                    if (!_verses?.includes(navState.verse)) {
                        setNavState((prevState) => ({ ...prevState, verse: 1 }));
                    }
                }
            }
        }
    }, [catalog, navState.docSetId, navState.bookCode, navState.chapter]);

    const setVerse = (e) => {
        setNavState((prevState) => ({ ...prevState, verse: e.detail.value }));
    };

    return (
        <IonSelect
            value={navState.verse}
            okText="Change"
            cancelText="Cancel"
            onIonChange={(e) => setVerse(e)}
        >
            {verses?.map((verse) => {
                return (
                    <IonSelectOption value={verse} key={verse}>
                        {verse}
                    </IonSelectOption>
                );
            })}
        </IonSelect>
    );
};

export default VerseDropDown;

VerseDropDown.propTypes = {
    navState: PropTypes.object.isRequired,
    setNavState: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired,
};
