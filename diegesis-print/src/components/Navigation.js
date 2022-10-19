import React from "react";
import BibleDropDown from "./BibleDropDown";
import { IonCol } from "@ionic/react";
import PropTypes from "prop-types";
import BookDropDown from "./BookDropDown";
import ChapterDropDown from "./ChapterDropDown";
import VerseDropDown from "./VerseDropDown";

const Navigation = ({ navState, setNavState, catalog, columns}) => {
    const { hideBookNav, hideChapterNav, hideVerseNav } = columns;
    return (
        <>
            <IonCol size={3}>
                <BibleDropDown navState={navState} setNavState={setNavState} catalog={catalog} />
            </IonCol>
            <IonCol size={3}>
                {hideBookNav || <BookDropDown navState={navState} setNavState={setNavState} catalog={catalog} />}
            </IonCol>
            <IonCol size={3}>
                {hideChapterNav || <ChapterDropDown navState={navState} setNavState={setNavState} catalog={catalog} />}
            </IonCol>
            <IonCol size={3}>
                {hideVerseNav || <VerseDropDown navState={navState} setNavState={setNavState} catalog={catalog} />}
            </IonCol>
        </>
    );
};

export default Navigation;

Navigation.propTypes = {
    navState: PropTypes.object.isRequired,
    setNavState: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
};
