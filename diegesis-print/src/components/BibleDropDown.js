import React, { useEffect, useState } from 'react';
import { IonSelect, IonSelectOption } from '@ionic/react';
import PropTypes from 'prop-types';

const BibleDropDown = ({ navState, setNavState, catalog }) => {
    const [bibles, setBibles] = useState([]);
    useEffect(() => {
        if (catalog?.docSets) {
            setBibles(catalog?.docSets ?? []);
        }
    }, [catalog?.docSets]);

    const setBible = (value) => {
        setNavState((prevState) => ({ ...prevState, docSetId: value }));
    };
    return (
        <IonSelect
            value={navState.docSetId}
            okText="Change"
            cancelText="Cancel"
            onIonChange={(e) => setBible(e.detail.value)}
        >
            {bibles?.map((bible) => (
                <IonSelectOption value={bible.id} key={bible.id}>
                    {bible.id}
                </IonSelectOption>
            ))}
        </IonSelect>
    );
};

export default BibleDropDown;

BibleDropDown.propTypes = {
    navState: PropTypes.object.isRequired,
    setNavState: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired,
};
