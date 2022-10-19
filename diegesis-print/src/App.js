import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonRouterOutlet,
    IonTabBar,
    IonTabs,
    setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useProskomma } from 'proskomma-react-hooks';
import Print from './pages/Print/Print';
import { nt_uw_4book as frozen } from 'proskomma-frozen-archives';
import { useCatalog } from 'proskomma-react-hooks';
import { thaw } from 'proskomma-freeze';

import './App.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useState } from 'react';

setupIonicReact();

const App = () => {
    const initialState = {
        docSetId: 'xyz-eng_ult',
        bookCode: 'TIT',
        chapter: 1,
        verse: 1,
    };
    const [navState, setNavState] = useState(initialState);

    const verbose = true;
    const pkState = useProskomma({ verbose });

    useEffect(() => {
        thaw(pkState.proskomma, frozen).then(() => {
            console.log('thawed');
            pkState.newStateId();
        });
    }, []);

    const { catalog } = useCatalog({
        proskomma: pkState.proskomma,
        stateId: pkState.stateId,
        verbose: true,
        cv: true,
    });

    return (
        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                         <Route path="/print">
                            <Print
                                catalog={catalog}
                                navState={navState}
                                setNavState={setNavState}
                                pkState={pkState}
                            />
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/print" />
                        </Route>
                    </IonRouterOutlet>
                    <IonTabBar></IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
