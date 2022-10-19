import React from 'react';
import { IonCol, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import PropTypes from 'prop-types';
import Navigation from './Navigation';
import { useIonRouter } from "@ionic/react";

export default function PageHeader({ title, navState, setNavState, catalog, columns }) {
    // To do: Add Next, previous buttons as per the tab ie next chapter /previous chapter on chapters tab

    const router = useIonRouter();

    const getColumns = () => {
        //current pages- "versions","browseBook","browseChapter","browseVerse","browsePassage","search","print"
        //default pages to hide columns in, can be overridden via column props: columns = {{hideBookNav:false}}
        const hideBookPages = ['browsePassage', 'search', 'print'];
        const hideChaperPages = ['versions', 'browseBook', 'browsePassage', 'search', 'print'];
        const hideVersePages = ['versions', 'browseBook', 'browseChapter', 'browsePassage', 'search', 'print'];
        const page = router?.routeInfo?.pathname?.split('/')[1];
        const _hideBookNav = columns?.hideBookNav ?? hideBookPages.includes(page);
        const _hideChapterNav = columns?.hideChapterNav ?? hideChaperPages.includes(page);
        const _hideVerseNav = columns?.hideVerseNav ?? hideVersePages.includes(page);
        return {
            hideBookNav: _hideBookNav,
            hideChapterNav: _hideChapterNav,
            hideVerseNav: _hideVerseNav,
        };
    };

    return (
        <IonHeader>
            <IonToolbar>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonTitle size="large">{title} - Ripped from Diegesis Reboot</IonTitle>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <Navigation
                            navState={navState}
                            setNavState={setNavState}
                            catalog={catalog}
                            columns={getColumns()}
                        />
                    </IonRow>
                </IonGrid>
            </IonToolbar>
        </IonHeader>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
    navState: PropTypes.object.isRequired,
    setNavState: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired,
    columns: PropTypes.object,
};
