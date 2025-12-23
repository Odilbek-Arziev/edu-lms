import React from 'react';
import './assets/scss/themes.scss';
import Route from './Routes';
import LanguageLinesInitializer from "./Components/Custom/LanguageLines/LanguageLinesInitializer";

function App() {
    return (
        <LanguageLinesInitializer>
            <React.Fragment>
                <Route/>
            </React.Fragment>
        </LanguageLinesInitializer>
    );
}

export default App;
