import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function Detail({ livestock, related = [] }) {
    const images = livestock.images && livestock.images.length > 0 
        ? livestock.images 
        : [{ id: 1, image_url: '/images/hero-farm.jpg' }];
    
    const [selectedImage, setSelectedImage] = useState(images[0]?.image_url);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    // Clean phone number for WhatsApp URL
    const sellerPhone = (livestock.seller?.phone_number || '081234567890').replace(/[^0-9]/g, '');
    const waNumber = sellerPhone.startsWith('0') ? '62' + sellerPhone.slice(1) : sellerPhone;
    const waMessage = encodeURIComponent(
        `Halo Peternak ${livestock.seller?.name || 'Fresh Farm'},\nSaya tertarik dengan hewan ternak:\n- Judul: ${livestock.title}\n- Ras: ${livestock.breed}\n- Bobot: ${livestock.weight_kg} kg\n- Harga: ${formatCurrency(livestock.price)}\n\nBisa minta video fisik terbaru ternak ini sebelum saya booking? Terima kasih!`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

    return (
        <AppLayout currentRoute="catalog">
            <Head title={`${livestock.title} - Spesifikasi & Pemesanan`} />

            {/* Breadcrumb Header - Full Width Edge-to-Edge */}
            <div className="w-full bg-[#F4F2EC] border-b border-[#E7E5DF] py-4">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <nav className="flex items-center gap-2 text-xs font-semibold text-[#57534E]">
                        <Link href="/" className="hover:text-[#1B4332]">Beranda</Link>
                        <span>/</span>
                        <Link href="/katalog" className="hover:text-[#1B4332]">Katalog</Link>
                        <span>/</span>
                        <Link href={`/katalog?category=${livestock.category?.slug}`} className="hover:text-[#1B4332]">
                            {livestock.category?.name || 'Kategori'}
                        </Link>
                        <span>/</span>
                        <span className="text-[#1C1917] truncate max-w-xs">{livestock.title}</span>
                    </nav>
                </div>
            </div>

            {/* MAIN DETAIL SECTION - Full Width Edge-to-Edge */}
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Photos & Verification Badges */}
                    <div className="lg:col-span-6 xl:col-span-6 space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F4F2EC] border border-[#E7E5DF] shadow-xs">
                            <img
                                src={selectedImage || images[0]?.image_url}
                                alt={livestock.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1B4332] text-white">
                                    {livestock.category?.name || 'Ternak'}
                                </span>
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
                                    <span>Vaksin PMK Dosis 2</span>
                                </span>
                            </div>

                            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg font-mono">
                                Bobot Real: {livestock.weight_kg} kg
                            </div>
                        </div>

                        {/* Thumbnails Gallery */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setSelectedImage(img.image_url)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                                            selectedImage === img.image_url
                                                ? 'border-[#1B4332] shadow-sm'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Health & Guarantee Box */}
                        <div className="bg-[#F4F2EC] rounded-2xl p-5 border border-[#E7E5DF] space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1B4332]">
                                Standar Kesehatan & Jaminan Dokter Hewan
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#57534E]">
                                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E7E5DF]">
                                    <span className="text-base text-[#2D6A4F]">✓</span>
                                    <div>
                                        <strong className="text-[#1C1917] block">Bebas PMK</strong>
                                        <span>Status: {livestock.health_status}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E7E5DF]">
                                    <span className="text-base text-[#2D6A4F]">✓</span>
                                    <div>
                                        <strong className="text-[#1C1917] block">Timbangan Digital</strong>
                                        <span>Toleransi susut wajar kirim max 3%</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E7E5DF]">
                                    <span className="text-base text-[#2D6A4F]">✓</span>
                                    <div>
                                        <strong className="text-[#1C1917] block">Siap Kurban / Aqiqah</strong>
                                        <span>Cukup umur ({livestock.age_months} bulan) & tidak cacat</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E7E5DF]">
                                    <span className="text-base text-[#2D6A4F]">✓</span>
                                    <div>
                                        <strong className="text-[#1C1917] block">Garansi Pengiriman</strong>
                                        <span>Diganti jika hewan lemas atau sakit di jalan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Livestock Details, Price, Peternak Profile & Action Buttons */}
                    <div className="lg:col-span-6 xl:col-span-6 space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#F4F2EC] text-[#57534E]">
                                    ID #{livestock.id}
                                </span>
                                <span className="text-xs font-semibold text-[#C2410C]">
                                    Ras {livestock.breed}
                                </span>
                                <span className="text-xs text-[#57534E]">•</span>
                                <span className="text-xs text-[#57534E]">
                                    {livestock.seller?.city || 'Indonesia'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight mb-4">
                                {livestock.title}
                            </h1>

                            {/* Price Card */}
                            <div className="bg-[#FBFBF9] p-5 rounded-2xl border border-[#E7E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs text-[#57534E] block">Harga Hewan Ternak</span>
                                    <div className="text-3xl font-bold text-[#1B4332]">
                                        {formatCurrency(livestock.price)}
                                    </div>
                                </div>
                                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7E5DF]">
                                    <span className="text-xs text-[#57534E] block">Estimasi Harga / kg Hidup</span>
                                    <div className="text-base font-semibold text-[#1C1917]">
                                        Rp {Math.round(livestock.price / livestock.weight_kg).toLocaleString('id-ID')} / kg
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specification Matrix */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#57534E] mb-3">
                                Spesifikasi Fisik Ternak
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-xl bg-white border border-[#E7E5DF] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Bobot Hidup</span>
                                    <strong className="text-base text-[#1C1917] font-bold">
                                        {livestock.weight_kg} kg
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-[#E7E5DF] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Umur Ternak</span>
                                    <strong className="text-base text-[#1C1917] font-bold">
                                        {livestock.age_months} Bln
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-[#E7E5DF] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Kelamin</span>
                                    <strong className="text-base text-[#1C1917] font-bold capitalize">
                                        {livestock.gender === 'male' ? 'Jantan' : 'Betina'}
                                    </strong>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-[#E7E5DF] text-center">
                                    <span className="text-[11px] text-[#57534E] block">Ketersediaan</span>
                                    <strong className="text-base text-[#2D6A4F] font-bold">
                                        {livestock.stock} Ekor
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
                                Catatan Pemeliharaan & Deskripsi
                            </h3>
                            <div className="text-sm text-[#1C1917] leading-relaxed bg-white p-5 rounded-2xl border border-[#E7E5DF] whitespace-pre-line">
                                {livestock.description || 'Hewan ternak dirawat dengan pakan hijauan alami dan konsentrat bermutu tinggi, rutin dibersihkan dan berada dalam pengawasan dokter hewan setempat.'}
                            </div>
                        </div>

                        {/* Breeder / Kandang Card */}
                        <div className="bg-[#F4F2EC] p-5 rounded-2xl border border-[#E7E5DF]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                                    Mitra Peternak Terverifikasi
                                </span>
                                <span className="text-xs bg-[#D8F3DC] text-[#1B4332] font-semibold px-2.5 py-0.5 rounded-full">
                                    Kandang Terinspeksi
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg">
                                    {livestock.seller?.name?.charAt(0) || 'P'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base text-[#1C1917]">
                                        {livestock.seller?.name || 'Peternakan Mitra Fresh Farm'}
                                    </h4>
                                    <p className="text-xs text-[#57534E]">
                                        {livestock.seller?.address || 'Sentra Peternakan Rakyat'}, {livestock.seller?.city || 'Jawa'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main CTA Action Buttons */}
                        <div className="pt-2 space-y-3">
                            <Link
                                href={`/checkout/${livestock.id}`}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-base shadow-md hover:shadow-lg transition transform active:scale-95"
                            >
                                <span>Booking & Pesan Hewan Ini</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>

                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white hover:bg-[#FBFBF9] border border-[#E7E5DF] text-[#1C1917] font-semibold text-sm hover:border-[#1B4332] transition"
                            >
                                <svg className="w-4 h-4 text-[#2D6A4F] fill-current" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.088.072.191.014.307-.058.115-.087.187-.173.289l-.26.305c-.087.101-.177.21-.077.382.101.172.447.737.96 1.194.662.589 1.22.771 1.393.858.173.087.274.072.376-.044.101-.116.433-.505.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.203.043.072.043.419-.101.824z"/>
                                </svg>
                                <span>Tanya Peternak via WhatsApp (Minta Video Fisik)</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Related Livestock */}
                {related.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-[#E7E5DF]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                                    Pilihan Lainnya
                                </span>
                                <h3 className="text-xl font-bold text-[#1C1917] tracking-tight mt-1">
                                    Hewan Ternak Sejenis
                                </h3>
                            </div>
                            <Link
                                href={`/katalog?category=${livestock.category?.slug}`}
                                className="text-xs font-semibold text-[#1B4332] hover:underline"
                            >
                                Lihat Semua {livestock.category?.name} &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/livestock/${item.id}`}
                                    className="bg-white rounded-2xl overflow-hidden border border-[#E7E5DF] hover:border-[#1B4332] shadow-xs hover:shadow-md transition group"
                                >
                                    <div className="aspect-4/3 overflow-hidden bg-[#F4F2EC]">
                                        <img
                                            src={item.images?.[0]?.image_url || '/images/hero-farm.jpg'}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-medium text-[#C2410C] mb-1">
                                            {item.breed} • {item.weight_kg} kg
                                        </div>
                                        <h4 className="font-bold text-sm text-[#1C1917] group-hover:text-[#1B4332] transition line-clamp-1 mb-2">
                                            {item.title}
                                        </h4>
                                        <div className="text-sm font-bold text-[#1B4332]">
                                            {formatCurrency(item.price)}
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
