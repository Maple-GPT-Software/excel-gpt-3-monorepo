import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { isProd } from './settings';

import './index.style.css'
import AuthProvider from './AuthProvider';

const container = document.getElementById('index');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const firebaseStateDiv = document.getElementById("FIREBASE_STATE");


/**
 * Because firebase is loaded via CDN its possible for .getAuth() to be null
 * if the application loads before the lib is downloaded, in which case
 * we'd be trying to access methods on `null`. As such we listen to attribute
 * changes on div#FIREBASE_STATE dummy div and only render our application after 
 * firebase has been downloaded
 */
const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
            console.log('attribute changed', firebaseStateDiv.attributes);
            firebaseStateDiv.innerHTML = "";
            firebaseStateDiv.style = "";

            console.log('inside MutationObserver')
            root.render(
                <BrowserRouter basename={isProd ? '/userCodeAppPanel' : '/sidebar-app-impl.html'}>
                    <AuthProvider />
                </BrowserRouter>
            );
        }

        observer.disconnect();
    }
});

observer.observe(firebaseStateDiv, {attributes: true, childList: false, subtree: false});
