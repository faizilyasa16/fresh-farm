import React, { useEffect, useRef, useState } from 'react';

/**
 * Fades an element up the first time it scrolls into view.
 * Uses one IntersectionObserver per element and disconnects after the first hit.
 */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...props }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) {
            return undefined;
        }

        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
            className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
            {...props}
        >
            {children}
        </Tag>
    );
}
