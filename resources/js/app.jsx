import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

const pages = import.meta.glob('./Pages/**/*.jsx');

createInertiaApp({
    title: (title) => (title ? `${title} | Fresh Farm` : 'Fresh Farm | Marketplace Hewan Ternak Terpercaya'),
    resolve: (name) => {
        const importPage = pages[`./Pages/${name}.jsx`];
        if (!importPage) {
            throw new Error(`Page component "./Pages/${name}.jsx" could not be found.`);
        }
        return importPage();
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#2d6a4f',
        showSpinner: false,
    },
});
