import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import { formatRupiah } from '../Components/LivestockCard';

export default function Detail({ livestock, related = [] }) {
    const images = livestock.images && livestock.images.length > 0
        ? livestock.images
        : [{ id: 1, image_url: '/images/hero-farm.jpg' }];

    const [selectedImage, setSelectedImage] = useState(images[0]?.image_url);

    const sellerPhone = (livestock.seller?.phone_number || '081234567890').replace(/[^0-9]/g, '');
    const waNumber = sellerPhone.startsWith('0') ? '62' + sellerPhone.slice(1) : sellerPhone;
    const waMessage = encodeURIComponent(
        `Halo Peternak ${livestock.seller?.name || 'Fresh Farm'},\nSaya tertarik dengan hewan ternak:\n- Judul: ${livestock.title}\n- Ras: ${livestock.breed}\n- Bobot: ${livestock.weight_kg} kg\n- Harga: ${formatRupiah(livestock.price)}\n\nBisa minta video fisik terbaru ternak ini sebelum saya booking? Terima kasih.`
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
                    <div className="lg:col-span-6 space-y-4">
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F4F2EC] border border-[#D6D3CB]">
                            <img
                                src={selectedImage || images[0]?.image_url}
                                alt={livestock.title}
                                width="800"
                                height="600"
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                <span className="text-xs font-semibold px-3 py-1 rounded-md bg-[#1B4332] text-white">
                                    {livestock.category?.name || 'Ternak'}
                                </span>
                                <span className="text-xs font-semibold px-3 py-1 rounded-md bg-[#D8F3DC] text-[#1B4332]">
                                    Bebas PMK
                                </span>
                            </div>

                            <div className="absolute bottom-4 right-4 bg-[#1C1917]/90 text-white text-xs px-3 py-1.5 rounded-lg font-semibold tabular-nums">
                                Bobot Riil: {livestock.weight_kg} kg
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setSelectedImage(img.image_url)}
                                        aria-label="Pilih foto ternak"
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0 cursor-pointer ${
                                            selectedImage === img.image_url
                                                ? 'border-[#1B4332]'
                                                : 'border-[#78716C]/40 opacity-80 hover:opacity-100'
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
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#F4F2EC] border border-[#D6D3CB] text-[#1C1917]">
                                    ID #{livestock.id}
                                </span>
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

                        <div className="bg-[#F4F2EC] p-5 rounded-2xl border border-[#D6D3CB]">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-xs font-bold text-[#1B4332]">
                                    Profil Kandang Peternak
                                </span>
                                <span className="text-xs bg-[#D8F3DC] text-[#1B4332] font-semibold px-2.5 py-0.5 rounded-md">
                                    Kandang Terdaftar
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shrink-0">
                                    {livestock.seller?.name?.charAt(0) || 'P'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-[#1C1917]">
                                        {livestock.seller?.name || 'Peternakan Mitra Fresh Farm'}
                                    </h3>
                                    <p className="text-xs text-[#57534E]">
                                        {livestock.seller?.address || 'Sentra Peternakan Rakyat'}, {livestock.seller?.city || 'Jawa'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            {isAvailable ? (
                                <Link
                                    href={`/checkout/${livestock.id}`}
                                    className="min-h-11 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-base transition-colors"
                                >
                                    Booking dan Pesan Hewan Ini
                                </Link>
                            ) : (
                                <div className="w-full py-3.5 px-6 rounded-xl bg-[#E7E5DF] text-[#57534E] font-semibold text-sm text-center">
                                    Hewan Ini Sedang Dipesan atau Sudah Terjual
                                </div>
                            )}

                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-11 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white hover:bg-[#F4F2EC] border border-[#78716C] text-[#1C1917] font-semibold text-sm transition-colors"
                            >
                                Chat Peternak via WhatsApp (Minta Video Fisik)
                            </a>
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
