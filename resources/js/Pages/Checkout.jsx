import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function Checkout({ livestock }) {
    const isBigAnimal = ['sapi', 'kerbau'].includes(livestock.category?.slug);
    const courierRate = isBigAnimal ? 650000 : 350000;

    const { data, setData, post, processing, errors } = useForm({
        livestock_id: livestock.id,
        buyer_name: '',
        buyer_phone: '',
        shipping_address: '',
        delivery_method: 'courier', // default to courier
        notes: '',
    });

    const shippingCost = data.delivery_method === 'courier' ? courierRate : 0;
    const totalAmount = Number(livestock.price) + shippingCost;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/orders');
    };

    const primaryImage = livestock.images?.[0]?.image_url || '/images/hero-farm.jpg';

    return (
        <AppLayout currentRoute="catalog">
            <Head title={`Booking & Checkout: ${livestock.title}`} />

            {/* Breadcrumb Header - Full Width Edge-to-Edge */}
            <div className="w-full bg-[#F4F2EC] border-b border-[#E7E5DF] py-4">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <nav className="flex items-center gap-2 text-xs font-semibold text-[#57534E]">
                        <Link href="/" className="hover:text-[#1B4332]">Beranda</Link>
                        <span>/</span>
                        <Link href="/katalog" className="hover:text-[#1B4332]">Katalog</Link>
                        <span>/</span>
                        <Link href={`/livestock/${livestock.id}`} className="hover:text-[#1B4332] truncate max-w-xs">
                            {livestock.title}
                        </Link>
                        <span>/</span>
                        <span className="text-[#1C1917]">Checkout & Booking</span>
                    </nav>
                </div>
            </div>

            {/* MAIN CHECKOUT FORM & SUMMARY - Full Width Edge-to-Edge Container */}
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10">
                {/* Header Title */}
                <div className="mb-6 sm:mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                        Formulir Pemesanan Resmi
                    </span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917] tracking-tight mt-1">
                        Booking Hewan Ternak
                    </h1>
                    <p className="text-sm sm:text-base text-[#57534E] mt-1.5 max-w-3xl">
                        Lengkapi data di bawah ini. Ternak akan langsung di-reserve dan tidak dapat dipesan pembeli lain.
                    </p>
                </div>

                {/* 2-Column Responsive Full-Width Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
                    {/* Left Column: Form Pemesan (Expanded Full Width on Desktop, Responsive on Mobile) */}
                    <div className="lg:col-span-7 xl:col-span-8 bg-white p-5 sm:p-7 lg:p-9 rounded-2xl border border-[#E7E5DF] shadow-xs">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Buyer Name & WhatsApp in 2-col on large screens */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Buyer Name */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-2">
                                        Nama Lengkap Pemesan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.buyer_name}
                                        onChange={(e) => setData('buyer_name', e.target.value)}
                                        placeholder="Contoh: H. Ahmad Subardjo"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1917] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332] transition ${
                                            errors.buyer_name ? 'border-red-500 ring-1 ring-red-500' : 'border-[#E7E5DF]'
                                        }`}
                                    />
                                    {errors.buyer_name && (
                                        <p className="text-xs text-red-500 mt-1">{errors.buyer_name}</p>
                                    )}
                                </div>

                                {/* Buyer WhatsApp Phone */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-2">
                                        Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={data.buyer_phone}
                                        onChange={(e) => setData('buyer_phone', e.target.value)}
                                        placeholder="Contoh: 081234567890"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1917] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332] transition ${
                                            errors.buyer_phone ? 'border-red-500 ring-1 ring-red-500' : 'border-[#E7E5DF]'
                                        }`}
                                    />
                                    <p className="text-[11px] text-[#57534E] mt-1.5">
                                        Peternak akan menghubungi nomor ini untuk konfirmasi video & pengiriman.
                                    </p>
                                    {errors.buyer_phone && (
                                        <p className="text-xs text-red-500 mt-1">{errors.buyer_phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Method Selector */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-2">
                                    Metode Pengiriman Ternak <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                    {/* Courier Option */}
                                    <label
                                        className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-xl border cursor-pointer transition ${
                                            data.delivery_method === 'courier'
                                                ? 'border-[#1B4332] bg-[#D8F3DC]/25 shadow-xs ring-1 ring-[#1B4332]'
                                                : 'border-[#E7E5DF] bg-[#FBFBF9] hover:border-[#1B4332]/40'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="courier"
                                            checked={data.delivery_method === 'courier'}
                                            onChange={(e) => setData('delivery_method', e.target.value)}
                                            className="mt-1 text-[#1B4332] focus:ring-[#1B4332] w-4 h-4"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-baseline justify-between gap-1">
                                                <span className="font-bold text-sm text-[#1C1917]">
                                                    Armada Angkut Khusus
                                                </span>
                                                <span className="font-bold text-sm text-[#1B4332]">
                                                    {formatCurrency(courierRate)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                                                Ternak diantar menggunakan truk/pick-up ber-ventilasi, alas jerami tebal, pakan segar selama jalan, dan pendamping profesional.
                                            </p>
                                        </div>
                                    </label>

                                    {/* Pickup Option */}
                                    <label
                                        className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-xl border cursor-pointer transition ${
                                            data.delivery_method === 'pickup'
                                                ? 'border-[#1B4332] bg-[#D8F3DC]/25 shadow-xs ring-1 ring-[#1B4332]'
                                                : 'border-[#E7E5DF] bg-[#FBFBF9] hover:border-[#1B4332]/40'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="pickup"
                                            checked={data.delivery_method === 'pickup'}
                                            onChange={(e) => setData('delivery_method', e.target.value)}
                                            className="mt-1 text-[#1B4332] focus:ring-[#1B4332] w-4 h-4"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-baseline justify-between gap-1">
                                                <span className="font-bold text-sm text-[#1C1917]">
                                                    Ambil Langsung di Kandang
                                                </span>
                                                <span className="font-bold text-sm text-[#2D6A4F]">
                                                    Gratis (Rp 0)
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                                                Bawa kendaraan sendiri ke kandang di {livestock.seller?.city || 'lokasi peternak'}. Serah terima fisik dan timbang digital langsung di tempat.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                {errors.delivery_method && (
                                    <p className="text-xs text-red-500 mt-1">{errors.delivery_method}</p>
                                )}
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-2">
                                    Alamat Lengkap Pengiriman / Domisili <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={data.shipping_address}
                                    onChange={(e) => setData('shipping_address', e.target.value)}
                                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten..."
                                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1917] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332] transition ${
                                        errors.shipping_address ? 'border-red-500 ring-1 ring-red-500' : 'border-[#E7E5DF]'
                                    }`}
                                />
                                {errors.shipping_address && (
                                    <p className="text-xs text-red-500 mt-1">{errors.shipping_address}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-2">
                                    Catatan Tambahan untuk Peternak (Opsional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Misal: Harap kirim H-2 Idul Adha, minta dimandikan sebelum dikirim..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#E7E5DF] text-sm text-[#1C1917] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332] transition"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white font-bold text-base shadow-md hover:shadow-lg transition transform active:scale-95 cursor-pointer"
                                >
                                    {processing ? (
                                        <span>Memproses Pemesanan...</span>
                                    ) : (
                                        <>
                                            <span>Konfirmasi Booking Ternak Sekarang</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                                <p className="text-[11px] text-[#57534E] text-center mt-3">
                                    🔒 Bebas risiko. Ternak dipesan dan status dikunci, pembayaran melalui rekening bersama.
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary & Guarantee (Sticky Sidebar on Desktop) */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white p-5 sm:p-6 lg:p-7 rounded-2xl border border-[#E7E5DF] shadow-xs">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-[#1C1917] pb-3 mb-4 border-b border-[#E7E5DF]">
                                Ringkasan Pesanan
                            </h3>

                            {/* Livestock Card Preview */}
                            <div className="flex gap-4 pb-4 mb-4 border-b border-[#E7E5DF]">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F4F2EC] shrink-0 border border-[#E7E5DF]">
                                    <img
                                        src={primaryImage}
                                        alt={livestock.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[11px] font-semibold text-[#C2410C] block">
                                        {livestock.breed} • {livestock.gender === 'male' ? 'Jantan' : 'Betina'}
                                    </span>
                                    <h4 className="font-bold text-sm text-[#1C1917] leading-tight line-clamp-2 mt-0.5">
                                        {livestock.title}
                                    </h4>
                                    <p className="text-xs text-[#57534E] mt-1">
                                        Bobot: <strong className="text-[#1C1917]">{livestock.weight_kg} kg</strong>
                                    </p>
                                    <p className="text-xs text-[#57534E]">
                                        Kandang: {livestock.seller?.city || 'Indonesia'}
                                    </p>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-3 text-sm text-[#57534E]">
                                <div className="flex justify-between items-center">
                                    <span>Harga Hewan Ternak</span>
                                    <span className="font-semibold text-[#1C1917]">
                                        {formatCurrency(livestock.price)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span>Biaya Pengiriman</span>
                                    <span className="font-semibold text-[#1C1917]">
                                        {shippingCost > 0 ? formatCurrency(shippingCost) : 'Gratis (Pickup)'}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-[#E7E5DF] flex justify-between items-baseline">
                                    <span className="font-bold text-base text-[#1C1917]">Total Tagihan</span>
                                    <span className="font-bold text-2xl text-[#1B4332]">
                                        {formatCurrency(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Checklist */}
                        <div className="bg-[#F4F2EC] p-5 sm:p-6 rounded-2xl border border-[#E7E5DF] text-xs space-y-3 text-[#57534E]">
                            <div className="flex items-center gap-2 font-bold text-[#1B4332] text-sm">
                                <span>🛡️ Jaminan Transaksi Fresh Farm</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-[#2D6A4F] font-bold">✓</span>
                                <span>Ternak langsung dikunci statusnya ke "Booked" agar tidak diambil pembeli lain.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-[#2D6A4F] font-bold">✓</span>
                                <span>Peternak mengirimkan video kondisi hewan terbaru sebelum diberangkatkan.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-[#2D6A4F] font-bold">✓</span>
                                <span>Garansi penggantian apabila hewan mati atau cidera berat saat perjalanan.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
