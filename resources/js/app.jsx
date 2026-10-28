import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import Lenis from 'lenis';

// Initialize Lenis Smooth Scrolling for buttery 60fps performance without jank
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Export lenis instance for component-level control if needed
window.__lenis = lenis;

createInertiaApp({
    title: (title) => title ? `${title} - Fresh Farm` : 'Fresh Farm - Marketplace Hewan Ternak Terpercaya',
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        const page = pages[`./Pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page component "./Pages/${name}.jsx" could not be found.`);
        }
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#2d6a4f',
        showSpinner: true,
    },
});
