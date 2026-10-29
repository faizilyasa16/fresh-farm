import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import { formatRupiah } from '../Components/LivestockCard';

export default function Detail({ livestock, related = [] }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || null;
    const images = livestock.images && livestock.images.length > 0
        ? livestock.images
        : [{ id: 1, image_url: '/images/hero-farm.jpg' }];

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const activeImage = images[selectedImageIndex]?.image_url || images[0]?.image_url;

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const sellerAddress = livestock.seller?.address?.trim() || '';
    const sellerCity = livestock.seller?.city?.trim() || '';
    const displayLocation = sellerAddress && sellerCity && sellerAddress.toLowerCase() !== sellerCity.toLowerCase()
        ? `${sellerAddress}, ${sellerCity}`
        : (sellerCity || sellerAddress || 'Indonesia');

    const sellerPhone = (livestock.seller?.phone_number || '081234567890').replace(/[^0-9]/g, '');
    const waNumber = sellerPhone.startsWith('0') ? '62' + sellerPhone.slice(1) : sellerPhone;
    const buyerName = currentUser?.name ? `Saya ${currentUser.name}` : 'Saya';
    const waMessage = encodeURIComponent(
        `Halo Peternak ${livestock.seller?.name || 'Fresh Farm'},\n${buyerName} tertarik dengan hewan ternak:\n- Judul: ${livestock.title}\n- Ras: ${livestock.breed}\n- Bobot: ${livestock.weight_kg} kg\n- Harga: ${formatRupiah(livestock.price)}\n\nBisa minta video fisik terbaru ternak ini sebelum saya booking? Terima kasih.`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

    const isAvailable = livestock.status === 'available';

    return (
        <AppLayout currentRoute="catalog">
            <Head title={`${livestock.title} | Spesifikasi dan Pemesanan`} />

            <div className="w-full bg-[#F4F2EC] border-b border-[#D6D3CB] py-4">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <nav className="flex items-center gap-2 text-xs font-semibold text-[#57534E] flex-wrap" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-[#1B4332] hover:underline">Beranda</Link>
                        <span>/</span>
                        <Link href="/katalog" className="hover:text-[#1B4332] hover:underline">Katalog</Link>
                        <span>/</span>
                        <Link href={`/katalog?category=${livestock.category?.slug}`} className="hover:text-[#1B4332] hover:underline">
                            {livestock.category?.name || 'Kategori'}
                        </Link>
                        <span>/</span>
                        <span className="text-[#1C1917] truncate max-w-xs">{livestock.title}</span>
                    </nav>
                </div>
            </div>

            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-6 space-y-5">
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F4F2EC] border border-[#D6D3CB] group">
                            <img
                                src={activeImage}
                                alt={livestock.title}
                                width="800"
                                height="600"
                                decoding="async"
                                className="w-full h-full object-cover transition-opacity duration-200"
                            />
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                                <span className="text-xs font-semibold px-3 py-1 rounded-md bg-[#1B4332] text-white shadow-xs">
                                    {livestock.category?.name || 'Ternak'}
                                </span>
                            </div>

                            {/* Foto Badge Counter */}
                            {images.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/65 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-xs pointer-events-none">
                                    <svg className="w-3.5 h-3.5 text-[#95D5B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{selectedImageIndex + 1} / {images.length} Foto</span>
                                </div>
                            )}

                            {/* Tombol Navigasi Panah pada Foto */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 active:scale-90 cursor-pointer shadow-md"
                                        aria-label="Foto sebelumnya"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 active:scale-90 cursor-pointer shadow-md"
                                        aria-label="Foto berikutnya"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            <div className="absolute bottom-4 right-4 bg-[#1C1917]/90 text-white text-xs px-3 py-1.5 rounded-lg font-semibold tabular-nums pointer-events-none">
                                Bobot Riil: {livestock.weight_kg} kg
                            </div>
                        </div>

                        {/* Thumbnails Foto */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id || idx}
                                        type="button"
                                        onClick={() => setSelectedImageIndex(idx)}
                                        aria-label={`Pilih foto ternak ke-${idx + 1}`}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                            selectedImageIndex === idx
                                                ? 'border-[#1B4332] ring-2 ring-[#1B4332]/25 scale-102 shadow-xs'
                                                : 'border-[#D6D3CB] opacity-70 hover:opacity-100 hover:border-[#78716C]'
                                        }`}
                                    >
                                        <img src={img.image_url} alt="" decoding="async" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-6 space-y-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-[#9A3412]">
                                    Ras {livestock.breed}
                                </span>
                                <span className="text-xs text-[#57534E]">&bull;</span>
                                <span className="text-xs text-[#57534E]">
                                    {livestock.seller?.city || 'Indonesia'}
                                </span>
                                {!isAvailable && (
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                                        Status: {livestock.status === 'booked' ? 'Sedang Dipesan' : 'Terjual'}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight mb-4">
                                {livestock.title}
                            </h1>

                            <div className="bg-white p-5 rounded-2xl border border-[#D6D3CB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs text-[#57534E] block">Harga Hewan Ternak</span>
                                    <div className="text-2xl sm:text-3xl font-bold text-[#1B4332] tabular-nums">
                                        {formatRupiah(livestock.price)}
                                    </div>
                                </div>
                                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7E5DF]">
                                    <span className="text-xs text-[#57534E] block">Estimasi Harga / kg Hidup</span>
                                    <div className="text-base font-semibold text-[#1C1917] tabular-nums">
                                        Rp {Math.round(livestock.price / livestock.weight_kg).toLocaleString('id-ID')} / kg
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-[#1C1917] mb-3">
                                Spesifikasi Fisik Ternak
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-xl bg-white border border-[#D6D3CB] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Bobot Hidup</span>
                                    <strong className="text-base text-[#1C1917] font-bold tabular-nums">
                                        {livestock.weight_kg} kg
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-[#D6D3CB] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Umur Ternak</span>
                                    <strong className="text-base text-[#1C1917] font-bold tabular-nums">
                                        {livestock.age_months} Bln
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-[#D6D3CB] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Kelamin</span>
                                    <strong className="text-base text-[#1C1917] font-bold">
                                        {livestock.gender === 'male' ? 'Jantan' : 'Betina'}
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-[#D6D3CB] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Ketersediaan</span>
                                    <strong className="text-base text-[#1B4332] font-bold tabular-nums">
                                        {livestock.stock} Ekor
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-[#1C1917] mb-2">
                                Catatan Pemeliharaan dan Pakan
                            </h2>
                            <div className="text-sm text-[#1C1917] leading-relaxed bg-white p-5 rounded-2xl border border-[#D6D3CB] whitespace-pre-line">
                                {livestock.description || 'Hewan ternak dirawat dengan pakan hijauan segar dan konsentrat terukur di bawah pengawasan kesehatan rutin kandang.'}
                            </div>
                        </div>

                        {/* Profil Kandang Peternak (Di Bawah Catatan) */}
                        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D6D3CB]">
                            <div className="flex items-center gap-3.5">
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] text-[#1B4332] flex items-center justify-center font-bold">
                                        <svg className="w-6 h-6 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 21h18M3 10l9-7 9 7v11H3V10z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 21V12h6v9" />
                                        </svg>
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#1B4332] text-white flex items-center justify-center border-2 border-white shadow-2xs" title="Peternak Resmi">
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-base text-[#1C1917] truncate">
                                        {livestock.seller?.name || 'Peternakan Mitra Fresh Farm'}
                                    </h3>
                                    <p className="text-xs text-[#57534E] flex items-center gap-1.5 mt-0.5 truncate">
                                        <svg className="w-3.5 h-3.5 text-[#78716C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="truncate">{displayLocation}</span>
                                    </p>
                                </div>
                            </div>
                        </div>



                        <div className="pt-2 space-y-3">
                            {isAvailable ? (
                                currentUser ? (
                                    <Link
                                        href={`/checkout/${livestock.id}`}
                                        className="min-h-11 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-base transition-colors"
                                    >
                                        Booking dan Pesan Hewan Ini
                                    </Link>
                                ) : (
                                    <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#D6D3CB] space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#9A3412]">
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span>Wajib Memiliki Akun untuk Membeli</span>
                                        </div>
                                        <p className="text-xs text-[#57534E] leading-relaxed">
                                            Silakan masuk atau daftar akun terlebih dahulu agar pesanan tercatat resmi di sistem dan terlindungi garansi.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <Link
                                                href="/login"
                                                className="min-h-11 flex items-center justify-center py-2.5 px-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-xs transition-colors text-center"
                                            >
                                                Masuk Akun
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="min-h-11 flex items-center justify-center py-2.5 px-3 rounded-xl bg-white hover:bg-[#F4F2EC] border border-[#78716C] text-[#1C1917] font-semibold text-xs transition-colors text-center"
                                            >
                                                Daftar Akun Baru
                                            </Link>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="w-full py-3.5 px-6 rounded-xl bg-[#E7E5DF] text-[#57534E] font-semibold text-sm text-center">
                                    Hewan Ini Sedang Dipesan atau Sudah Terjual
                                </div>
                            )}

                            {currentUser ? (
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="min-h-11 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white hover:bg-[#F4F2EC] border border-[#78716C] text-[#1C1917] font-semibold text-sm transition-colors text-center"
                                >
                                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                    </svg>
                                    <span>Chat Peternak via WhatsApp (Minta Video Fisik)</span>
                                </a>
                            ) : (
                                <Link
                                    href={`/login?redirect=/livestock/${livestock.id}`}
                                    className="min-h-11 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#F4F2EC] hover:bg-[#EAE7DF] border border-[#78716C]/60 text-[#57534E] hover:text-[#1C1917] font-semibold text-sm transition-colors text-center"
                                >
                                    <svg className="w-4 h-4 text-[#78716C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Masuk Akun untuk Chat Peternak via WhatsApp</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {related.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-[#D6D3CB]">
                        <div className="flex items-center justify-between gap-3 mb-7">
                            <div>
                                <h2 className="text-xl font-bold text-[#1C1917] tracking-tight">
                                    Hewan Ternak Sejenis
                                </h2>
                            </div>
                            <Link
                                href={`/katalog?category=${livestock.category?.slug}`}
                                className="min-h-11 inline-flex items-center text-xs font-semibold text-[#1B4332] hover:underline"
                            >
                                Lihat Semua {livestock.category?.name}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/livestock/${item.id}`}
                                    className="bg-white rounded-2xl overflow-hidden border border-[#D6D3CB] hover:border-[#1B4332] transition-colors flex flex-col"
                                >
                                    <div className="aspect-4/3 overflow-hidden bg-[#F4F2EC]">
                                        <img
                                            src={item.images?.[0]?.image_url || '/images/hero-farm.jpg'}
                                            alt={item.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-semibold text-[#9A3412] mb-1">
                                            {item.breed} &bull; {item.weight_kg} kg
                                        </div>
                                        <h3 className="font-bold text-sm text-[#1C1917] line-clamp-1 mb-2">
                                            {item.title}
                                        </h3>
                                        <div className="text-sm font-bold text-[#1B4332] tabular-nums">
                                            {formatRupiah(item.price)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
