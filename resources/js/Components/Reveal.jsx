import React from 'react';

export default function Reveal({ as: Tag = 'div', className = '', delay: _delay, children, ...props }) {
    return (
        <Tag className={className} {...props}>
            {children}
        </Tag>
    );
}
