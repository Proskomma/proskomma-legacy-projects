import React, { useState, useEffect } from "react";
import { IonSelect, IonSelectOption } from "@ionic/react";
import PropTypes from "prop-types";

const ChapterDropDown = ({ navState, setNavState, catalog }) => {
    const [chapters, setChapters] = useState([]);
    useEffect(() => {
        if (catalog?.docSets) {
            const bible = catalog.docSets.find((bible) => bible.id === navState.docSetId);
            if (bible?.documents) {
                const book = bible?.documents.find((book) => book.bookCode === navState.bookCode);
                const _chapters = book?.cvNumbers.map((item) => item.chapter) ?? [];
                setChapters(_chapters);
                //if invalid chapter ie chapter not in chapter list set to 1
                if (!_chapters?.includes(navState.chapter)) {
                    setNavState((prevState) => ({ ...prevState, chapter: 1 }));
                }
            }
        }
    }, [catalog, navState.docSetId, navState.bookCode]);

    const setChapter = (e) => {
        setNavState((prevState) => ({ ...prevState, chapter: e.detail.value }));
    };

    return (
        <IonSelect
            value={navState.chapter}
            okText="Change"
            cancelText="Cancel"
            onIonChange={(e) => setChapter(e)}
        >
            {chapters?.map((chapter) => {
                return (
                    <IonSelectOption value={chapter} key={chapter}>
                        {chapter}
                    </IonSelectOption>
                );
            })}
        </IonSelect>
    );
};

export default ChapterDropDown;

ChapterDropDown.propTypes = {
    navState: PropTypes.object.isRequired,
    setNavState: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired,
};
