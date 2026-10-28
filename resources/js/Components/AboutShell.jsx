import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

const sections = [
    { key: 'about-kami', label: 'Tentang Kami', href: '/tentang/kami' },
    { key: 'about-hubungi', label: 'Hubungi Kami', href: '/tentang/hubungi' },
    { key: 'about-lokasi', label: 'Lokasi', href: '/tentang/lokasi' },
    { key: 'about-pengiriman', label: 'Pengiriman', href: '/tentang/pengiriman' },
    { key: 'about-garansi', label: 'Tentang Garansi', href: '/tentang/garansi' },
];

/**
 * Shared frame for the About pages: page header, section tabs, and content slot.
 */
export default function AboutShell({ routeKey, title, intro, children }) {
    return (
        <AppLayout currentRoute={routeKey}>
            <Head title={title} />

            <section className="w-full bg-[#F4F2EC] border-b border-[#E7E5DF]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-10 sm:pt-14">
                    <div className="anim-slide-left max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Tentang Fresh Farm</span>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917] mt-2">{title}</h1>
                        <p className="text-base text-[#57534E] mt-3 leading-relaxed">{intro}</p>
                    </div>

                    <nav
                        className="anim-fade-up anim-delay-2 mt-8 flex gap-1 overflow-x-auto"
                        aria-label="Bagian Tentang Fresh Farm"
                    >
                        {sections.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                aria-current={routeKey === item.key ? 'page' : undefined}
                                className={`whitespace-nowrap px-4 py-3 text-sm border-b-2 transition ${
                                    routeKey === item.key
                                        ? 'border-[#1B4332] text-[#1B4332] font-semibold'
                                        : 'border-transparent text-[#57534E] hover:text-[#1B4332]'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </section>

            <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14">{children}</section>
        </AppLayout>
    );
}
