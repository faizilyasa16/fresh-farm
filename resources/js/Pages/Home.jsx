import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import LivestockCard, { formatRupiah } from '../Components/LivestockCard';
import {
    DigitalScaleIcon,
    EscrowLockIcon,
    LivestockCategoryIcon,
    LivestockTruckIcon,
    VetShieldIcon,
    getCategoryImageUrl,
} from '../Components/LivestockIcons';

function HeroShowcaseCarousel({ items = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [userStoppedAutoPlay, setUserStoppedAutoPlay] = useState(false);
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
        if (total <= 1 || isPaused || userStoppedAutoPlay) {
            return undefined;
        }

        if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const timerId = window.setInterval(goToNext, 4200);
        return () => window.clearInterval(timerId);
    }, [total, isPaused, userStoppedAutoPlay, goToNext]);

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
            <div className="rounded-2xl bg-white border border-[#D6D3CB] p-8 text-center">
                <h2 className="text-lg font-bold text-[#1C1917] mb-2">Belum Ada Dokumentasi Ternak</h2>
                <p className="text-sm text-[#57534E] mb-5">
                    Data hewan ternak akan tampil otomatis di sini setelah mitra peternak menambahkan stok kandang.
                </p>
                <Link
                    href="/login"
                    className="min-h-11 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-sm font-semibold"
                >
                    Masuk sebagai Peternak
                </Link>
            </div>
        );
    }

    const safeIndex = activeIndex % total;
    const current = items[safeIndex];
    const imageUrl = current.images?.[0]?.image_url || '/images/hero-farm.jpg';

    return (
        <div
            className="rounded-2xl overflow-hidden bg-white border border-[#D6D3CB] shadow-md"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label="Galeri hewan ternak unggulan siap kirim"
        >
            <div className="relative aspect-16/11 sm:aspect-16/10 overflow-hidden bg-[#E7E5DF]">
                <img
                    key={current.id}
                    src={imageUrl}
                    alt={current.title}
                    width="800"
                    height="500"
                    decoding="async"
                    className="w-full h-full object-cover"
                />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#1C1917]/85 text-white text-xs font-semibold tabular-nums">
                        {safeIndex + 1} / {total}
                    </span>
                </div>

                {total > 1 && (
                    <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={goToPrev}
                            className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F4F2EC] text-[#1C1917] border border-[#78716C] shadow-xs transition-colors cursor-pointer"
                            aria-label="Lihat hewan sebelumnya"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={goToNext}
                            className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F4F2EC] text-[#1C1917] border border-[#78716C] shadow-xs transition-colors cursor-pointer"
                            aria-label="Lihat hewan berikutnya"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <div className="p-5 sm:p-6 bg-white border-t border-[#E7E5DF]" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#9A3412]">
                            {current.category?.name || 'Ternak'} Ras {current.breed}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#D8F3DC] text-[#1B4332]">
                            Bebas PMK
                        </span>
                    </div>
                    <span className="text-xs text-[#57534E] font-medium">
                        Kandang: {current.seller?.city || 'Indonesia'}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] leading-snug line-clamp-1">
                        <Link href={`/livestock/${current.id}`} className="hover:text-[#1B4332] transition-colors">
                            {current.title}
                        </Link>
                    </h2>
                    <span className="text-base sm:text-lg font-bold text-[#1B4332] shrink-0 tabular-nums">
                        {formatRupiah(current.price)}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-[#57534E] pt-3 border-t border-[#E7E5DF]">
                    <div>
                        <span className="block text-[11px]">Bobot Riil</span>
                        <strong className="text-[#1C1917] font-bold tabular-nums">{current.weight_kg} kg</strong>
                    </div>
                    <div>
                        <span className="block text-[11px]">Umur</span>
                        <strong className="text-[#1C1917] font-bold tabular-nums">{current.age_months} Bulan</strong>
                    </div>
                    <div className="text-right">
                        <span className="block text-[11px]">Status Medis</span>
                        <strong className="text-[#1B4332] font-bold line-clamp-1">SKKH Aktif</strong>
                    </div>
                </div>

                {total > 1 && (
                    <div className="mt-4 pt-3 border-t border-[#E7E5DF] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 flex-wrap" role="tablist" aria-label="Pilih slide hewan">
                            {items.map((item, idx) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={idx === safeIndex}
                                    aria-label={`Tampilkan ${item.title}`}
                                    onClick={() => setActiveIndex(idx)}
                                    className="min-w-8 min-h-11 inline-flex items-center justify-center px-1 cursor-pointer"
                                >
                                    <span
                                        className={`block h-2.5 rounded-full transition-all duration-200 ${
                                            idx === safeIndex
                                                ? 'w-7 bg-[#1B4332]'
                                                : 'w-2.5 bg-[#78716C]/60 hover:bg-[#1B4332]/70'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Link
                                href={`/livestock/${current.id}`}
                                className="min-h-11 inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#C2410C] hover:bg-[#9A3412] text-xs font-semibold text-white transition-colors"
                            >
                                Lihat Hewan
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Home({ featuredLivestocks = [], categories = [], stats = {} }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || null;

    const carouselRef = useRef(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(featuredLivestocks.length > 1);

    const categoryCarouselRef = useRef(null);
    const [canScrollCatPrev, setCanScrollCatPrev] = useState(false);
    const [canScrollCatNext, setCanScrollCatNext] = useState(categories.length > 2);

    const updateCategoryCarouselButtons = useCallback(() => {
        const track = categoryCarouselRef.current;
        if (!track) {
            return;
        }
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        setCanScrollCatPrev(track.scrollLeft > 8);
        setCanScrollCatNext(track.scrollLeft < maxScrollLeft - 8);
    }, []);

    useEffect(() => {
        const track = categoryCarouselRef.current;
        if (!track) {
            return undefined;
        }
        updateCategoryCarouselButtons();
        track.addEventListener('scroll', updateCategoryCarouselButtons, { passive: true });
        window.addEventListener('resize', updateCategoryCarouselButtons, { passive: true });

        return () => {
            track.removeEventListener('scroll', updateCategoryCarouselButtons);
            window.removeEventListener('resize', updateCategoryCarouselButtons);
        };
    }, [updateCategoryCarouselButtons, categories.length]);

    const scrollCategoryBy = (direction) => {
        const track = categoryCarouselRef.current;
        if (!track) {
            return;
        }
        const firstCard = track.firstElementChild;
        const step = firstCard ? firstCard.getBoundingClientRect().width + 16 : track.clientWidth * 0.75;
        track.scrollBy({
            left: direction * step,
            behavior: 'smooth',
        });
    };

    const updateCarouselButtons = useCallback(() => {
        const track = carouselRef.current;
        if (!track) {
            return;
        }
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        setCanScrollPrev(track.scrollLeft > 8);
        setCanScrollNext(track.scrollLeft < maxScrollLeft - 8);
    }, []);

    useEffect(() => {
        const track = carouselRef.current;
        if (!track) {
            return undefined;
        }
        updateCarouselButtons();
        track.addEventListener('scroll', updateCarouselButtons, { passive: true });
        window.addEventListener('resize', updateCarouselButtons, { passive: true });

        return () => {
            track.removeEventListener('scroll', updateCarouselButtons);
            window.removeEventListener('resize', updateCarouselButtons);
        };
    }, [updateCarouselButtons, featuredLivestocks.length]);

    const scrollCardsBy = (direction) => {
        const track = carouselRef.current;
        if (!track) {
            return;
        }
        const firstCard = track.firstElementChild;
        const step = firstCard ? firstCard.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
        track.scrollBy({
            left: direction * step,
            behavior: 'smooth',
        });
    };

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

            <section className="w-full py-10 sm:py-12 bg-white border-b border-[#E7E5DF]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-[#1C1917] tracking-tight">
                                Filter Cepat Jenis Hewan
                            </h2>
                            <p className="text-sm text-[#57534E] mt-1">
                                Geser ke samping untuk memilih jenis ternak sesuai kebutuhan peternakan, konsumsi, kurban, aqiqah, atau kuliner.
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                            {categories.length > 1 && (
                            <div className="hidden md:flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => scrollCategoryBy(-1)}
                                        disabled={!canScrollCatPrev}
                                        className="min-w-10 min-h-10 inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F4F2EC] disabled:opacity-40 disabled:pointer-events-none border border-[#78716C] text-[#1C1917] transition-colors cursor-pointer"
                                        aria-label="Geser kategori ke kiri"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollCategoryBy(1)}
                                        disabled={!canScrollCatNext}
                                        className="min-w-10 min-h-10 inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F4F2EC] disabled:opacity-40 disabled:pointer-events-none border border-[#78716C] text-[#1C1917] transition-colors cursor-pointer"
                                        aria-label="Geser kategori ke kanan"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <Link
                                href="/katalog"
                                className="min-h-10 inline-flex items-center text-sm font-semibold text-[#1B4332] hover:underline px-2"
                            >
                                Buka Semua di Katalog
                            </Link>
                        </div>
                    </div>

                    <div
                        ref={categoryCarouselRef}
                        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 pb-3 no-scrollbar scroll-smooth"
                        aria-label="Carousel filter jenis hewan ternak"
                    >
                        {categories.map((cat) => {
                            const imgUrl = getCategoryImageUrl(cat);
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/katalog?category=${cat.slug}`}
                                    className="shrink-0 snap-start w-56 sm:w-64 p-3.5 sm:p-4 rounded-2xl bg-[#FBFBF9] hover:bg-[#F4F2EC] border border-[#78716C]/40 hover:border-[#1B4332] transition-all hover:shadow-md flex flex-col justify-between group cursor-pointer"
                                >
                                    <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-3 bg-[#EAE7DF] border border-[#D6D3CB]">
                                        {imgUrl ? (
                                            <img
                                                src={imgUrl}
                                                alt={cat.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#D8F3DC] text-[#1B4332]">
                                                <LivestockCategoryIcon slug={cat.icon_url || cat.slug} className="w-12 h-12" />
                                            </div>
                                        )}
                                        <span className="absolute top-2.5 right-2.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#1C1917]/85 text-white tabular-nums backdrop-blur-xs">
                                            {cat.livestocks_count || 0} Ekor
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between gap-1.5 mb-1">
                                            <h3 className="font-bold text-base text-[#1C1917] group-hover:text-[#1B4332] transition-colors truncate">
                                                {cat.name}
                                            </h3>
                                            <span className="text-xs text-[#1B4332] font-semibold group-hover:translate-x-0.5 transition-transform">
                                                &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
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
                                Geser ke samping untuk membandingkan ternak yang sudah melewati timbangan hidup dan pemeriksaan SKKH.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            {featuredLivestocks.length > 1 && (
                            <div className="hidden md:flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => scrollCardsBy(-1)}
                                        disabled={!canScrollPrev}
                                        className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F4F2EC] disabled:opacity-40 disabled:pointer-events-none border border-[#78716C] text-[#1C1917] transition-colors cursor-pointer"
                                        aria-label="Geser daftar kartu ternak ke kiri"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollCardsBy(1)}
                                        disabled={!canScrollNext}
                                        className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl bg-white hover:bg-[#F4F2EC] disabled:opacity-40 disabled:pointer-events-none border border-[#78716C] text-[#1C1917] transition-colors cursor-pointer"
                                        aria-label="Geser daftar kartu ternak ke kanan"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            <Link
                                href="/katalog"
                                className="min-h-11 inline-flex items-center px-5 py-2.5 rounded-xl bg-white hover:bg-[#F4F2EC] border border-[#78716C] text-sm font-semibold text-[#1B4332] transition-colors"
                            >
                                Lihat Semua ({stats.total_livestock ?? featuredLivestocks.length} Ternak)
                            </Link>
                        </div>
                    </div>

                    {featuredLivestocks.length > 0 ? (
                        <div
                            ref={carouselRef}
                            className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-5 pb-3 no-scrollbar"
                            aria-label="Carousel kartu hewan ternak siap kirim"
                        >
                            {featuredLivestocks.map((livestock) => (
                                <div
                                    key={livestock.id}
                                    className="shrink-0 snap-start w-[85%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]"
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
