import React, { useEffect, useState } from 'react';
import { IonSelect, IonSelectOption } from '@ionic/react';
import PropTypes from 'prop-types';
const BookDropDown = ({ navState, setNavState, catalog }) => {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        if (catalog?.docSets && navState?.docSetId) {
            //find document in catalog using current bible ie navState.docSetId
            const findBible = (doc) => doc.id === navState.docSetId;
            const bible = catalog?.docSets.find(findBible);
            setDocuments(bible?.documents ?? []);
            //See if current book is in current bible, fallback to first book of current Bible
            const book =
                bible?.documents.find((doc) => doc.bookCode === navState.bookCode) ??
                bible?.documents[0];
            if (book && book.bookCode !== navState.bookCode) {
                setNavState((prevState) => ({ ...prevState, bookCode: book.bookCode }));
            }
        }
    }, [catalog?.docSets, navState.docSetId]);
    const setBook = (e) => {
        setNavState((prevState) => ({ ...prevState, bookCode: e.detail.value }));
    };

    return (
        <IonSelect
            value={navState.bookCode}
            okText="Change"
            cancelText="Cancel"
            onIonChange={(e) => setBook(e)}
        >
            {documents?.map((document) => {
                return (
                    <IonSelectOption value={document.bookCode} key={document.id}>
                        {document.bookCode}
                    </IonSelectOption>
                );
            })}
        </IonSelect>
    );
};

export default BookDropDown;

BookDropDown.propTypes = {
    navState: PropTypes.object.isRequired,
    setNavState: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired,
};
