import React from 'react';

export const CATEGORY_ICON_OPTIONS = [
    { value: 'sapi', label: 'Siluet Sapi' },
    { value: 'kambing', label: 'Siluet Kambing' },
    { value: 'domba', label: 'Siluet Domba' },
    { value: 'kerbau', label: 'Siluet Kerbau' },
    { value: 'ayam', label: 'Siluet Ayam / Unggas' },
    { value: 'babi', label: 'Siluet Babi' },
    { value: 'bebek', label: 'Siluet Bebek / Itik' },
    { value: 'kuda', label: 'Siluet Kuda' },
    { value: 'kelinci', label: 'Siluet Kelinci' },
    { value: 'ikan', label: 'Siluet Ikan / Perikanan' },
    { value: 'lainnya', label: 'Siluet Hewan Lainnya / Umum' },
];

export const DEFAULT_CATEGORY_IMAGES = {
    sapi: '/images/sapi-limousin.jpg',
    kambing: '/images/kambing-etawa.jpg',
    domba: '/images/domba-garut.jpg',
    kerbau: '/images/kerbau-murrah.jpg',
};

export function getCategoryImageUrl(cat) {
    if (!cat) {
        return null;
    }
    if (typeof cat === 'string') {
        const key = getCategoryIconKey(cat);
        return DEFAULT_CATEGORY_IMAGES[key] || null;
    }
    if (cat.image_url) {
        return cat.image_url;
    }
    const key = getCategoryIconKey(cat.icon_url || cat.slug);
    return DEFAULT_CATEGORY_IMAGES[key] || null;
}

export function getCategoryIconKey(slugOrIcon) {
    if (!slugOrIcon) {
        return 'lainnya';
    }
    const s = String(slugOrIcon).toLowerCase().trim();
    if (s === 'sapi' || s === 'cow' || s.includes('sapi') || s.includes('lembu') || s.includes('bull')) {
        return 'sapi';
    }
    if (s === 'kambing' || s === 'goat' || s.includes('kambing')) {
        return 'kambing';
    }
    if (s === 'domba' || s === 'sheep' || s.includes('domba')) {
        return 'domba';
    }
    if (s === 'kerbau' || s === 'buffalo' || s.includes('kerbau')) {
        return 'kerbau';
    }
    if (
        s === 'ayam' ||
        s === 'chicken' ||
        s.includes('ayam') ||
        s.includes('unggas') ||
        s.includes('broiler') ||
        s.includes('rooster') ||
        s.includes('kalkun')
    ) {
        return 'ayam';
    }
    if (s === 'babi' || s === 'pig' || s.includes('babi') || s.includes('pork') || s.includes('swine')) {
        return 'babi';
    }
    if (s === 'bebek' || s === 'duck' || s.includes('bebek') || s.includes('itik') || s.includes('angsa')) {
        return 'bebek';
    }
    if (s === 'kuda' || s === 'horse' || s.includes('kuda')) {
        return 'kuda';
    }
    if (s === 'kelinci' || s === 'rabbit' || s.includes('kelinci') || s.includes('bunny')) {
        return 'kelinci';
    }
    if (
        s === 'ikan' ||
        s === 'fish' ||
        s.includes('ikan') ||
        s.includes('lele') ||
        s.includes('nila') ||
        s.includes('patin')
    ) {
        return 'ikan';
    }
    return 'lainnya';
}

export function LivestockCategoryIcon({ slug, className = 'w-7 h-7' }) {
    const key = getCategoryIconKey(slug);

    switch (key) {
        case 'sapi':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 10c1.5-2.5 4.2-3 6-1.5M27 10c-1.5-2.5-4.2-3-6-1.5" />
                    <path d="M9 11h14l1.5 7.5c.3 2.5-1.5 5.5-4.5 5.5h-8c-3 0-4.8-3-4.5-5.5L9 11Z" />
                    <path d="M6 12.5c-1.8.3-3 1.5-3 3 0 .8.8 1.5 2 1.5h2.8M26 12.5c1.8.3 3 1.5 3 3 0 .8-.8 1.5-2 1.5h-2.8" />
                    <rect x="11" y="19" width="10" height="5" rx="2.5" />
                    <circle cx="12.5" cy="15" r="1" fill="currentColor" stroke="none" />
                    <circle cx="19.5" cy="15" r="1" fill="currentColor" stroke="none" />
                    <circle cx="14" cy="21.5" r="0.9" fill="currentColor" stroke="none" />
                    <circle cx="18" cy="21.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
            );

        case 'kambing':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12.5 9.5C11.5 6.5 9.5 5 7.5 5.5M19.5 9.5C20.5 6.5 22.5 5 24.5 5.5" />
                    <path d="M10.5 10.5h11l-1.5 10.5c-.3 1.8-1.8 3-3.5 3h-1c-1.7 0-3.2-1.2-3.5-3l-1.5-10.5Z" />
                    <path d="M10.5 12c-2.5.8-4.5 3-4.5 5.5 1.8.4 3.5-.4 5-2M21.5 12c2.5.8 4.5 3 4.5 5.5-1.8.4-3.5-.4-5-2" />
                    <path d="M15 24l1 3.5 1-3.5" />
                    <circle cx="13.5" cy="15" r="1" fill="currentColor" stroke="none" />
                    <circle cx="18.5" cy="15" r="1" fill="currentColor" stroke="none" />
                </svg>
            );

        case 'domba':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M11 10.5c-3.5-2-6.5.5-6 4 .4 2.5 3 3.2 4.5 1.5M21 10.5c3.5-2 6.5.5 6 4-.4 2.5-3 3.2-4.5 1.5" />
                    <path d="M12 9c1-1.5 2.5-2 4-2s3 .5 4 2" />
                    <path d="M11 11.5h10l-1.2 9.5c-.3 2-1.8 3.5-3.8 3.5s-3.5-1.5-3.8-3.5L11 11.5Z" />
                    <circle cx="13.8" cy="15.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="18.2" cy="15.5" r="1" fill="currentColor" stroke="none" />
                    <path d="M14.5 20.5h3" />
                </svg>
            );

        case 'kerbau':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 11C6 10.5 3 8 3.5 5c1.5 2 3.8 3 6.8 3.2M22 11c4-.5 7-3 6.5-6-1.5 2-3.8 3-6.8 3.2" />
                    <path d="M9.5 11.5h13l1 7.5c.2 2.5-1.5 5-4 5h-7c-2.5 0-4.2-2.5-4-5l1-7.5Z" />
                    <rect x="11.5" y="19" width="9" height="4.8" rx="2.2" />
                    <circle cx="13" cy="15.2" r="1" fill="currentColor" stroke="none" />
                    <circle cx="19" cy="15.2" r="1" fill="currentColor" stroke="none" />
                </svg>
            );

        case 'ayam':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {/* Jengger / Rooster Comb */}
                    <path d="M13 7c-.5-1.8 1-3 2.5-2.5 1-1.5 2.8-1.5 3.5.5 1-.8 2.8.2 2.5 2.2" />
                    {/* Badan & Leher Ayam */}
                    <path d="M12.5 8.5c-2 2.5-1 5.5 1 8 2 2.5 4.5 4 8 4 3 0 4.5-2 5.5-4.5" />
                    {/* Paruh */}
                    <path d="M10 12l-4 1.5 4 1.5" />
                    {/* Gelambir di bawah paruh */}
                    <path d="M10 16c-.8 1-.8 2.5.2 3.2 1 .7 2 0 1.8-1.7" />
                    {/* Ekor bulu */}
                    <path d="M24 14.5c2-3 2.8-6.5 1-9.5-2.2 1.8-3.2 4.5-3.5 6.5" />
                    <path d="M22 12c1.8-2 2-4.5 1-6.5-1.8 1.2-2.5 3-2.8 4.8" />
                    {/* Mata */}
                    <circle cx="13.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
                    {/* Kaki ayam */}
                    <path d="M16 20.5v6.5m0 0l-2.5 1m2.5-1l2.5 1" />
                </svg>
            );

        case 'babi':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {/* Telinga kiri & kanan yang khas */}
                    <path d="M8 12c-1.8-4-1-8 2-7 2.2 1 2.2 4 1.8 6M24 12c1.8-4 1-8-2-7-2.2 1-2.2 4-1.8 6" />
                    {/* Kepala bulat */}
                    <path d="M10 11h12c3.5 0 5.5 2.5 5.5 6v2c0 4.5-3.5 7.5-7.5 7.5h-6c-4 0-7.5-3-7.5-7.5v-2c0-3.5 2-6 5.5-6Z" />
                    {/* Moncong babi (snout) oval dengan dua lubang hidung */}
                    <rect x="11" y="16" width="10" height="7" rx="3.5" />
                    <circle cx="13.8" cy="19.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="18.2" cy="19.5" r="1" fill="currentColor" stroke="none" />
                    {/* Mata */}
                    <circle cx="12" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
                    <circle cx="20" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
                </svg>
            );

        case 'bebek':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {/* Kepala dan badan bebek */}
                    <path d="M14 9c0-3 2-4.5 4.5-4.5s4 2 4 4.5c0 2-1 3.5-1.8 4.5 1.5 2 2.5 4.5 2.5 7.5 0 3.5-3 5.5-6.8 5.5-5 0-8.2-2.5-8.8-6.5-.4-3.5 1.8-6 4.8-7.5" />
                    {/* Paruh bebek mendatar */}
                    <path d="M14.5 10.5H7.5c-2 0-3 1.5-3 2.5s1.5 2 3.5 2h6.5" />
                    {/* Ekor bebek mencuat */}
                    <path d="M23.5 19l4-2.5c.5 2-.5 4-2 5" />
                    {/* Mata */}
                    <circle cx="17.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
                    {/* Garis air kolam */}
                    <path d="M7 28.5c3-1 6 1 9 0s6-1 9 0" />
                </svg>
            );

        case 'kuda':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {/* Telinga kuda & jambul */}
                    <path d="M18 5l1.5 4M15 6l1 3" />
                    {/* Garis kepala & moncong kuda */}
                    <path d="M13 8.5l-3 6.5c-1 2.5 0 5.5 2 7l-2.5 3.5 3.5 1 2-2.5c2 1 4.5 1 6.5 0 2-1 3-3 3-5.5V11c0-3.5-2.5-6-6-6-1.5 0-4 1-5.5 3.5Z" />
                    {/* Surai / rambut kuda */}
                    <path d="M21 9c2 1 3 3 3 5M22 15c2 1 2.5 3 2.5 5" />
                    {/* Mata & lubang hidung */}
                    <circle cx="15.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
                    <circle cx="11.5" cy="22" r="0.8" fill="currentColor" stroke="none" />
                </svg>
            );

        case 'kelinci':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {/* Telinga panjang kiri & kanan */}
                    <path d="M12 12C11 7 9.5 3.5 11.5 3s3 3 2.5 9M20 12c1-5 2.5-8.5.5-9s-3 3-2.5 9" />
                    {/* Kepala bulat & pipi */}
                    <path d="M11 13c-3 1.5-4.5 4.5-4 7.5.5 3.5 4 6 9 6s8.5-2.5 9-6c.5-3-1-6-4-7.5" />
                    <circle cx="12.5" cy="17.5" r="1.1" fill="currentColor" stroke="none" />
                    <circle cx="19.5" cy="17.5" r="1.1" fill="currentColor" stroke="none" />
                    {/* Hidung & kumis */}
                    <path d="M15 20.5l1 1 1-1" />
                    <path d="M7 19.5h3M6 22h4M25 19.5h-3M26 22h-4" />
                </svg>
            );

        case 'ikan':
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 16c4.5-6 13-7 18-2 1.5-2 3.5-3.5 5-4v12c-1.5-.5-3.5-2-5-4-5 5-13.5 4-18-2Z" />
                    <path d="M13 10c1-2.5 3-3.5 5-3.5M14 22c1 2 2.5 3 4.5 3" />
                    <path d="M16 13c1 2 1 4 0 6" />
                    <circle cx="9.5" cy="15" r="1.1" fill="currentColor" stroke="none" />
                </svg>
            );

        default:
            return (
                <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 26h22M7 26V13l9-6 9 6v13M13 26v-7h6v7" />
                    <path d="M16 11v3M14.5 12.5h3" />
                </svg>
            );
    }
}

export function VetShieldIcon({ className = 'w-6 h-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l7 3v5c0 5-3.2 8.6-7 10-3.8-1.4-7-5-7-10V6l7-3Z" />
            <path d="M9.5 12h5M12 9.5v5" />
        </svg>
    );
}

export function DigitalScaleIcon({ className = 'w-6 h-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M8 9.5a4.5 4.5 0 018 0" />
            <path d="M12 10l2-2" />
            <path d="M8 15h8" />
        </svg>
    );
}

export function LivestockTruckIcon({ className = 'w-6 h-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h11v10H3z" />
            <path d="M14 9h4l3 3v4h-7V9z" />
            <circle cx="7.5" cy="17.5" r="2" />
            <circle cx="17.5" cy="17.5" r="2" />
            <path d="M6 9v4M9 9v4M12 9v4" />
        </svg>
    );
}

export function EscrowLockIcon({ className = 'w-6 h-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" />
            <path d="M12 15v2" />
        </svg>
    );
}
