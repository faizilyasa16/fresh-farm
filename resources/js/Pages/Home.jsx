import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import LivestockCard, { formatRupiah } from '../Components/LivestockCard';
import {
    DigitalScaleIcon,
    EscrowLockIcon,
    LivestockTruckIcon,
    VetShieldIcon,
} from '../Components/LivestockIcons';

function useDragScroll() {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const stateRef = useRef({
        isDown: false,
        startX: 0,
        scrollLeft: 0,
        hasMoved: false,
        animId: null,
        history: [],
    });

    const stopMomentum = useCallback(() => {
        if (stateRef.current.animId) {
            cancelAnimationFrame(stateRef.current.animId);
            stateRef.current.animId = null;
        }
    }, []);

    const onMouseDown = useCallback((e) => {
        // Only respond to left mouse button
        if (e.button !== 0) {
            return;
        }
        const container = ref.current;
        if (!container) {
            return;
        }

        stopMomentum();

        stateRef.current.isDown = true;
        stateRef.current.startX = e.clientX;
        stateRef.current.scrollLeft = container.scrollLeft;
        stateRef.current.hasMoved = false;
        stateRef.current.history = [{ x: e.clientX, t: performance.now() }];
        setIsDragging(true);

        const onMouseMove = (moveEvent) => {
            if (!stateRef.current.isDown) {
                return;
            }
            const currentContainer = ref.current;
            if (!currentContainer) {
                return;
            }

            const deltaX = moveEvent.clientX - stateRef.current.startX;
            if (Math.abs(deltaX) > 4) {
                stateRef.current.hasMoved = true;
            }

            // Direct 1:1 scroll without lag or multiplier
            currentContainer.scrollLeft = stateRef.current.scrollLeft - deltaX;

            const now = performance.now();
            stateRef.current.history.push({ x: moveEvent.clientX, t: now });
            // Only keep points from last 90ms for accurate release velocity
            stateRef.current.history = stateRef.current.history.filter((p) => now - p.t < 90);
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);

            if (!stateRef.current.isDown) {
                return;
            }
            stateRef.current.isDown = false;
            setIsDragging(false);

            const currentContainer = ref.current;
            if (!currentContainer) {
                return;
            }

            // Calculate flick momentum velocity
            const history = stateRef.current.history;
            if (history.length >= 2) {
                const oldest = history[0];
                const newest = history[history.length - 1];
                const dt = newest.t - oldest.t;
                if (dt > 10) {
                    const vx = (newest.x - oldest.x) / dt; // px per ms
                    if (Math.abs(vx) > 0.15) {
                        let stepVelocity = -vx * 16; // px per frame
                        if (stepVelocity > 35) stepVelocity = 35;
                        if (stepVelocity < -35) stepVelocity = -35;
                        const friction = 0.94;

                        const momentumStep = () => {
                            if (!ref.current || Math.abs(stepVelocity) < 0.25) {
                                stateRef.current.animId = null;
                                return;
                            }
                            ref.current.scrollLeft += stepVelocity;
                            stepVelocity *= friction;
                            stateRef.current.animId = requestAnimationFrame(momentumStep);
                        };

                        stateRef.current.animId = requestAnimationFrame(momentumStep);
                    }
                }
            }

            if (stateRef.current.hasMoved) {
                setTimeout(() => {
                    stateRef.current.hasMoved = false;
                }, 50);
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mouseup', onMouseUp);
    }, [stopMomentum]);

    const onClickCapture = useCallback((e) => {
        if (stateRef.current.hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    const scrollByAmount = useCallback((direction) => {
        const container = ref.current;
        if (!container) {
            return;
        }
        stopMomentum();
        const cardStep = Math.max(280, Math.round(container.clientWidth * 0.72));
        container.scrollBy({ left: direction * cardStep, behavior: 'smooth' });
    }, [stopMomentum]);

    useEffect(() => {
        return () => {
            stopMomentum();
        };
    }, [stopMomentum]);

    return {
        ref,
        isDragging,
        scrollByAmount,
        events: {
            onMouseDown,
            onClickCapture,
            onDragStart: (e) => e.preventDefault(),
        },
    };
}

function HeroShowcaseCarousel({ items = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);
    const total = items.length;

    const goToNext = useCallback(() => {
        if (total <= 1) {
            return;
        }
        setActiveIndex((prev) => (prev + 1) % total);
    }, [total]);

    const goToPrev = useCallback(() => {
        if (total <= 1) {
            return;
        }
        setActiveIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    useEffect(() => {
        if (total <= 1 || isPaused) {
            return undefined;
        }

        if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const timerId = window.setInterval(goToNext, 3800);
        return () => window.clearInterval(timerId);
    }, [total, isPaused, goToNext]);

    useEffect(() => {
        if (total <= 1 || typeof Image === 'undefined') {
            return;
        }
        const nextItem = items[(activeIndex + 1) % total];
        const nextUrl = nextItem?.images?.[0]?.image_url;
        if (nextUrl) {
            const preload = new Image();
            preload.src = nextUrl;
        }
    }, [activeIndex, items, total]);

    if (total === 0) {
        return (
            <div className="relative aspect-16/10 rounded-3xl overflow-hidden bg-[#E7E5DF] border border-[#D6D3CB] flex items-center justify-center p-8 text-center shadow-lg">
                <img
                    src="/images/hero-farm.jpg"
                    alt="Fresh Farm Hero"
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    const safeIndex = activeIndex % total;

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        if (diff > 50) {
            goToNext();
        } else if (diff < -50) {
            goToPrev();
        }
    };

    return (
        <div
            className="relative w-full aspect-16/10 sm:aspect-16/10 lg:aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-[#D6D3CB]/70 bg-[#1C1917] select-none group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-roledescription="carousel"
            aria-label="Image auto carousel hewan ternak siap kirim"
        >
            {/* Smooth fading / sliding images */}
            {items.map((item, idx) => {
                const itemImg = item.images?.[0]?.image_url || '/images/hero-farm.jpg';
                const isActive = idx === safeIndex;
                return (
                    <div
                        key={item.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                        aria-hidden={!isActive}
                    >
                        <Link href={`/livestock/${item.id}`} className="block w-full h-full relative cursor-pointer">
                            <img
                                src={itemImg}
                                alt={item.title}
                                width="800"
                                height="600"
                                decoding="async"
                                draggable={false}
                                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Gradient overlay for contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35 pointer-events-none" />

                            {/* Top right location badge */}
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs sm:text-sm text-white font-medium bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm pointer-events-none">
                                <svg className="w-3.5 h-3.5 text-[#95D5B2] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{item.seller?.city || 'Indonesia'}</span>
                            </div>

                            {/* Floating info overlay at the bottom */}
                            <div className="absolute bottom-8 sm:bottom-7 left-5 right-5 text-white pointer-events-none">
                                <h2 className="text-lg sm:text-2xl font-bold text-white drop-shadow-md truncate leading-snug">
                                    {item.title}
                                </h2>
                                <div className="text-base sm:text-xl font-bold text-[#95D5B2] drop-shadow-md tabular-nums mt-0.5">
                                    {formatRupiah(item.price)}
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}

            {/* Top counter badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tabular-nums border border-white/10 shadow-sm">
                    {safeIndex + 1} / {total}
                </span>
            </div>

            {/* Bottom dots navigation */}
            {total > 1 && (
                <div className="absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-center gap-1.5 pb-1">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Ke slide ${idx + 1}`}
                            className="min-w-6 min-h-6 inline-flex items-center justify-center cursor-pointer p-1"
                        >
                            <span
                                className={`block h-1.5 rounded-full transition-all duration-300 ${
                                    idx === safeIndex
                                        ? 'w-7 bg-white shadow-xs'
                                        : 'w-2 bg-white/45 hover:bg-white/80'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Home({ featuredLivestocks = [], categories = [], stats = {} }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || null;

    const livestockDrag = useDragScroll();

    return (
        <AppLayout currentRoute="home">
            <Head title="Pasar Hewan Ternak Langsung dari Peternak Lokal" />

            <section className="w-full bg-[#F4F2EC] border-b border-[#D6D3CB] py-8 sm:py-12 lg:py-16">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-6">
                            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-[#1C1917] leading-[1.18] mb-5">
                                Pasar Hewan Ternak Terpercaya Langsung dari{' '}
                                <span className="text-[#1B4332] underline decoration-[#2D6A4F]/60">Peternak Lokal</span>
                            </h1>

                            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed mb-7 max-w-2xl">
                                Pilih sapi, kambing, domba, ayam/unggas, babi, hingga aneka hewan ternak lainnya dengan data bobot timbangan digital, umur riil, serta surat keterangan kesehatan hewan (SKKH) dari kandang mitra.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
                                <Link
                                    href="/katalog"
                                    className="min-h-11 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-base font-semibold transition-colors"
                                >
                                    <span>Jelajahi Katalog Ternak</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>

                                {currentUser ? (
                                    <Link
                                        href="/dashboard"
                                        className="min-h-11 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-[#FBFBF9] text-[#1C1917] border border-[#78716C] text-base font-semibold transition-colors"
                                    >
                                        Buka Dashboard Saya
                                    </Link>
                                ) : (
                                    <Link
                                        href="/register"
                                        className="min-h-11 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-[#FBFBF9] text-[#1C1917] border border-[#78716C] text-base font-semibold transition-colors"
                                    >
                                        Gabung Mitra Peternak
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D6D3CB]">
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-[#1B4332] tabular-nums">
                                        {stats.total_livestock ?? 0} Ekor
                                    </div>
                                    <div className="text-xs text-[#57534E] font-medium mt-0.5">Ternak Tersedia</div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-[#1B4332] tabular-nums">
                                        {stats.total_sellers ?? 0} Mitra
                                    </div>
                                    <div className="text-xs text-[#57534E] font-medium mt-0.5">Kandang Terdaftar</div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-[#1B4332] tabular-nums">
                                        {stats.total_cities ?? 0} Kota
                                    </div>
                                    <div className="text-xs text-[#57534E] font-medium mt-0.5">Sentra Peternakan</div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block lg:col-span-6 w-full">
                            <HeroShowcaseCarousel items={featuredLivestocks} />
                        </div>
                    </div>
                </div>
            </section>



            <section className="w-full py-12 sm:py-16 bg-[#FBFBF9] border-b border-[#E7E5DF]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
                        <div>
                            <p className="text-xs font-bold text-[#9A3412] mb-1">
                                Pilihan Rekomendasi
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                                Hewan Ternak Siap Kirim Hari Ini
                            </h2>
                            <p className="text-sm text-[#57534E] mt-1">
                                Tarik atau geser ke samping untuk membandingkan ternak yang sudah melewati timbangan hidup dan pemeriksaan SKKH.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <Link
                                href="/katalog"
                                className="min-h-11 inline-flex items-center px-5 py-2.5 rounded-xl bg-white hover:bg-[#F4F2EC] border border-[#78716C] text-sm font-semibold text-[#1B4332] transition-colors"
                            >
                                Lihat Semua ({stats.total_livestock ?? featuredLivestocks.length} Ternak) &rarr;
                            </Link>
                        </div>
                    </div>

                    {featuredLivestocks.length > 0 ? (
                        <div
                            ref={livestockDrag.ref}
                            {...livestockDrag.events}
                            className="flex flex-nowrap overflow-x-auto gap-5 pb-3 no-scrollbar select-none cursor-grab active:cursor-grabbing touch-pan-x overscroll-x-contain"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                            aria-label="Daftar rekomendasi kartu hewan ternak geser dan drag"
                        >
                            {featuredLivestocks.map((livestock) => (
                                <div
                                    key={livestock.id}
                                    className="shrink-0 w-[85%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] select-none"
                                >
                                    <LivestockCard livestock={livestock} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white border border-[#D6D3CB] p-10 text-center max-w-xl mx-auto">
                            <h3 className="text-lg font-bold text-[#1C1917] mb-1">
                                Belum Ada Ternak Tersedia Hari Ini
                            </h3>
                            <p className="text-sm text-[#57534E] mb-5">
                                Seluruh stok sedang dipesan atau belum ada listing baru dari mitra peternak.
                            </p>
                            <Link
                                href="/katalog"
                                className="min-h-11 inline-flex items-center px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-sm font-semibold"
                            >
                                Cek Katalog Lengkap
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <section className="w-full py-12 sm:py-16 bg-white">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="max-w-5xl mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                            Standar Pemeriksaan dan Pengiriman Kandang
                        </h2>
                        <p className="text-sm sm:text-base text-[#57534E] mt-2">
                            Setiap transaksi dilengkapi verifikasi fisik sebelum ternak diberangkatkan dari kandang ke lokasi Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#D6D3CB]">
                            <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                                <VetShieldIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Sertifikasi Medis SKKH
                            </h3>
                            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                                Setiap ternak dilengkapi surat keterangan kesehatan hewan dari dinas terkait serta riwayat vaksinasi PMK.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#D6D3CB]">
                            <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                                <DigitalScaleIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Timbangan Hidup Digital
                            </h3>
                            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                                Bobot dicatat dari hasil timbangan digital kandang dan dapat ditimbang ulang saat serah terima langsung.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#D6D3CB]">
                            <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                                <LivestockTruckIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Armada Angkut Berventilasi
                            </h3>
                            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                                Pengiriman menggunakan armada khusus ternak beralas jerami dengan pakan rumput segar selama perjalanan.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#D6D3CB]">
                            <div className="w-11 h-11 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-4">
                                <EscrowLockIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Konfirmasi Bukti &amp; Penguncian Stok
                            </h3>
                            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                                Saat dipesan, status hewan otomatis dikunci menjadi Booked sehingga tidak dapat dipesan ganda oleh pembeli lain.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
