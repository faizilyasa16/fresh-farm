import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Inventory({ livestocks, categories = [], sellers = [], currentSeller, filterStatus = 'all' }) {
    const [showAddModal, setShowAddModal] = useState(false);

    // Add Form
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category_id: categories[0]?.id || '',
        seller_id: currentSeller?.id || 1,
        breed: '',
        gender: 'male',
        weight_kg: '',
        age_months: '',
        price: '',
        stock: 1,
        health_status: 'Vaksin PMK Lengkap & Surat Sehat',
        description: '',
        image_url: '',
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post('/seller/livestock', {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };

    const handleStatusChange = (id, newStatus) => {
        router.put(`/seller/livestock/${id}`, { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id, title) => {
        if (confirm(`Yakin ingin mengarsipkan hewan ternak "${title}"?`)) {
            router.delete(`/seller/livestock/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleFilterStatus = (status) => {
        router.get('/seller/inventory', { status }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const totalCount = livestocks.total || 0;
    const availableCount = livestocks.data?.filter(l => l.status === 'available').length || 0;
    const bookedCount = livestocks.data?.filter(l => l.status === 'booked').length || 0;
    const soldCount = livestocks.data?.filter(l => l.status === 'sold').length || 0;

    return (
        <AppLayout currentRoute="seller">
            <Head title="Kelola Inventaris Ternak - Mitra Peternak Fresh Farm" />

            {/* Header - Full Width Edge-to-Edge */}
            <div className="w-full bg-[#F4F2EC] border-b border-[#E7E5DF] py-8">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C2410C] mb-1">
                                <Link href="/" className="hover:underline">Beranda</Link>
                                <span>/</span>
                                <span className="text-[#1C1917]">Dashboard Mitra Peternak</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                                Manajemen Inventaris Ternak Kandang
                            </h1>
                            <p className="text-sm text-[#57534E] mt-1">
                                Kelola stok hewan ternak, perbarui status ketersediaan, atau daftarkan ternak baru ke katalog pasar.
                            </p>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold shadow-sm transition transform active:scale-95"
                            >
                                <span className="text-lg leading-none">+</span>
                                <span>Tambah Hewan Ternak Baru</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        <div className="p-4 rounded-xl bg-white border border-[#E7E5DF]">
                            <span className="text-xs font-medium text-[#57534E] block">Total Koleksi</span>
                            <strong className="text-2xl font-bold text-[#1C1917] mt-1 block">
                                {totalCount} Ekor
                            </strong>
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-[#E7E5DF]">
                            <span className="text-xs font-medium text-[#2D6A4F] block">Tersedia di Katalog</span>
                            <strong className="text-2xl font-bold text-[#1B4332] mt-1 block">
                                {availableCount} Ekor
                            </strong>
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-[#E7E5DF]">
                            <span className="text-xs font-medium text-[#D97706] block">Dipesan / Booking</span>
                            <strong className="text-2xl font-bold text-[#D97706] mt-1 block">
                                {bookedCount} Ekor
                            </strong>
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-[#E7E5DF]">
                            <span className="text-xs font-medium text-[#57534E] block">Terjual / Lunas</span>
                            <strong className="text-2xl font-bold text-[#57534E] mt-1 block">
                                {soldCount} Ekor
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN TABLE AREA - Full Width Edge-to-Edge */}
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
                {/* Status Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-[#E7E5DF] text-xs">
                    {[
                        { id: 'all', label: 'Semua Status' },
                        { id: 'available', label: 'Tersedia' },
                        { id: 'booked', label: 'Dipesan (Booked)' },
                        { id: 'sold', label: 'Terjual' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleFilterStatus(tab.id)}
                            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition border ${
                                filterStatus === tab.id
                                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                                    : 'bg-white text-[#57534E] border-[#E7E5DF] hover:border-[#1B4332]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Livestock Table */}
                <div className="bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#FBFBF9] border-b border-[#E7E5DF] text-[#57534E] uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3.5 px-4">Hewan Ternak</th>
                                    <th className="py-3.5 px-4">Kategori & Ras</th>
                                    <th className="py-3.5 px-4">Bobot & Umur</th>
                                    <th className="py-3.5 px-4">Harga Jual</th>
                                    <th className="py-3.5 px-4">Status & Ubah</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E7E5DF]">
                                {livestocks.data && livestocks.data.length > 0 ? (
                                    livestocks.data.map((item) => {
                                        const primaryImg = item.images?.[0]?.image_url || '/images/hero-farm.jpg';
                                        return (
                                            <tr key={item.id} className="hover:bg-[#FBFBF9] transition">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F4F2EC] shrink-0">
                                                            <img src={primaryImg} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <strong className="text-sm text-[#1C1917] block line-clamp-1">
                                                                {item.title}
                                                            </strong>
                                                            <span className="text-[11px] text-[#57534E]">
                                                                ID #{item.id} • {item.gender === 'male' ? 'Jantan' : 'Betina'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="px-2 py-0.5 rounded bg-[#D8F3DC] text-[#1B4332] font-semibold block w-fit mb-1">
                                                        {item.category?.name || 'Ternak'}
                                                    </span>
                                                    <span className="text-[#57534E]">{item.breed}</span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <strong className="text-[#1C1917] block font-mono">{item.weight_kg} kg</strong>
                                                    <span className="text-[#57534E]">{item.age_months} Bulan</span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <strong className="text-sm text-[#1B4332] block font-semibold">
                                                        {formatCurrency(item.price)}
                                                    </strong>
                                                    <span className="text-[11px] text-[#57534E]">
                                                        Rp {Math.round(item.price / item.weight_kg).toLocaleString('id-ID')} / kg
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border focus:outline-none ${
                                                            item.status === 'available'
                                                                ? 'bg-[#D8F3DC] text-[#1B4332] border-[#52B788]/40'
                                                                : item.status === 'booked'
                                                                ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/40'
                                                                : item.status === 'sold'
                                                                ? 'bg-[#E7E5DF] text-[#57534E] border-[#D6D3CB]'
                                                                : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}
                                                    >
                                                        <option value="available">Tersedia</option>
                                                        <option value="booked">Dipesan (Booked)</option>
                                                        <option value="sold">Terjual</option>
                                                        <option value="archived">Diarsipkan</option>
                                                    </select>
                                                </td>

                                                <td className="py-3.5 px-4 text-right space-x-2">
                                                    <Link
                                                        href={`/livestock/${item.id}`}
                                                        className="px-2.5 py-1.5 rounded-lg border border-[#E7E5DF] hover:border-[#1B4332] text-[#1C1917] font-medium transition"
                                                    >
                                                        Lihat
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.title)}
                                                        className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition"
                                                    >
                                                        Arsipkan
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-[#57534E]">
                                            Tidak ada hewan ternak dalam daftar inventaris.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {livestocks.links && livestocks.links.length > 3 && (
                        <div className="p-4 border-t border-[#E7E5DF] flex items-center justify-center gap-1">
                            {livestocks.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-[#1B4332] text-white'
                                            : link.url
                                            ? 'bg-white border border-[#E7E5DF] text-[#1C1917] hover:bg-[#F4F2EC]'
                                            : 'text-stone-300 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL TAMBAH TERNAK BARU */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7E5DF] my-8 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E5DF]">
                            <h3 className="font-bold text-lg text-[#1C1917]">
                                Tambah Hewan Ternak Baru ke Katalog
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="text-[#57534E] hover:text-[#1C1917] text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                            {/* Title */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                    Nama / Judul Ternak *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Contoh: Sapi Simental Bobot 650kg Boyolali"
                                    className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                />
                                {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
                            </div>

                            {/* Category & Breed */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                        Kategori Hewan *
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                        Ras Ternak *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.breed}
                                        onChange={(e) => setData('breed', e.target.value)}
                                        placeholder="Contoh: Limousin Cross, Garut, Etawa"
                                        className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                    />
                                </div>
                            </div>

                            {/* Gender, Weight, Age */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                        Jenis Kelamin *
                                    </label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                    >
                                        <option value="male">Jantan</option>
                                        <option value="female">Betina</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                        Bobot (kg) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={data.weight_kg}
                                        onChange={(e) => setData('weight_kg', e.target.value)}
                                        placeholder="Contoh: 580"
                                        className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                        Umur (Bulan) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={data.age_months}
                                        onChange={(e) => setData('age_months', e.target.value)}
                                        placeholder="Contoh: 26"
                                        className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                    />
                                </div>
                            </div>

                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                        Harga Peternak (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="Contoh: 28000000"
                                        className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                        Jumlah Stok (Ekor) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                    />
                                </div>
                            </div>

                            {/* Health Status */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                    Status Kesehatan & PMK *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.health_status}
                                    onChange={(e) => setData('health_status', e.target.value)}
                                    placeholder="Contoh: Bebas PMK, Vaksin Dosis 2, SKKH Dinas Lengkap"
                                    className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-[#1C1917] mb-1">
                                    Catatan Pemeliharaan / Pakan
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Catatan riwayat pakan hijauan, konsentrat, atau kebiasaan ternak..."
                                    className="w-full px-3 py-2 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] focus:outline-none focus:border-[#1B4332]"
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E7E5DF]">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-[#E7E5DF] text-[#57534E] hover:text-[#1C1917]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan ke Katalog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
