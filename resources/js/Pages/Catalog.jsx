import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Reveal from '../Components/Reveal';

export default function Catalog({ livestocks, categories = [], cities = [], filters = {} }) {
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedGender, setSelectedGender] = useState(filters.gender || '');
    const [selectedCity, setSelectedCity] = useState(filters.city || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [minWeight, setMinWeight] = useState(filters.min_weight || '');
    const [maxWeight, setMaxWeight] = useState(filters.max_weight || '');
    const [selectedSort, setSelectedSort] = useState(filters.sort || 'latest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const handleApplyFilter = (e) => {
        if (e) e.preventDefault();

        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedGender) params.gender = selectedGender;
        if (selectedCity) params.city = selectedCity;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (minWeight) params.min_weight = minWeight;
        if (maxWeight) params.max_weight = maxWeight;
        if (selectedSort && selectedSort !== 'latest') params.sort = selectedSort;

        router.get('/katalog', params, {
            preserveState: true,
            preserveScroll: true,
        });

        setMobileFilterOpen(false);
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedGender('');
        setSelectedCity('');
        setMinPrice('');
        setMaxPrice('');
        setMinWeight('');
        setMaxWeight('');
        setSelectedSort('latest');

        router.get('/katalog', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryClick = (slug) => {
        const nextCat = selectedCategory === slug ? '' : slug;
        setSelectedCategory(nextCat);

        const params = { ...filters };
        if (nextCat) {
            params.category = nextCat;
        } else {
            delete params.category;
        }

        router.get('/katalog', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSortChange = (newSort) => {
        setSelectedSort(newSort);
        const params = { ...filters, sort: newSort };
        if (newSort === 'latest') delete params.sort;

        router.get('/katalog', params, {
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

    const hasActiveFilters = Boolean(
        selectedCategory || selectedGender || selectedCity || minPrice || maxPrice || minWeight || maxWeight || searchQuery
    );

    return (
        <AppLayout currentRoute="catalog">
            <Head title="Katalog Hewan Ternak Lengkap Sapi, Kambing, Domba, Kerbau" />

            {/* Header / Filter Bar - Full Width Edge-to-Edge */}
            <div className="w-full bg-[#F4F2EC] border-b border-[#E7E5DF] py-8">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C2410C] mb-1">
                                <Link href="/" className="hover:underline">Beranda</Link>
                                <span>/</span>
                                <span className="text-[#1C1917]">Katalog Ternak</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                                Eksplorasi Hewan Ternak Siap Kirim
                            </h1>
                            <p className="text-sm text-[#57534E] mt-1">
                                Menampilkan {livestocks.total || 0} ekor hewan ternak terverifikasi sehat dan timbangan riil.
                            </p>
                        </div>

                        {/* Search Input Box */}
                        <form onSubmit={handleApplyFilter} className="flex items-center gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari ras (Limousin, Garut), kota, atau judul..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E5DF] bg-white text-sm focus:outline-none focus:border-[#1B4332] text-[#1C1917]"
                                />
                                <svg className="w-4 h-4 text-[#57534E] absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Quick Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleCategoryClick('')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                                !selectedCategory
                                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                                    : 'bg-white text-[#57534E] border-[#E7E5DF] hover:border-[#1B4332]'
                            }`}
                        >
                            Semua Hewan
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryClick(cat.slug)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                                    selectedCategory === cat.slug
                                        ? 'bg-[#1B4332] text-white border-[#1B4332]'
                                        : 'bg-white text-[#57534E] border-[#E7E5DF] hover:border-[#1B4332]'
                                }`}
                            >
                                <span>{cat.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-[#F4F2EC] text-[#57534E]'
                                }`}>
                                    {cat.livestocks_count || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CATALOG CONTENT - Full Width Edge-to-Edge */}
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
                {/* Mobile Filter Toggle & Sort Bar */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E7E5DF]">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E7E5DF] text-xs font-semibold text-[#1C1917]"
                        >
                            <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filter Lanjutan</span>
                            {hasActiveFilters && (
                                <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="text-xs font-semibold text-[#C2410C] hover:underline"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#57534E] hidden sm:inline">Urutkan:</span>
                        <select
                            value={selectedSort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="py-2 px-3 rounded-lg border border-[#E7E5DF] bg-white text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#1B4332]"
                        >
                            <option value="latest">Terbaru Ditambahkan</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                            <option value="weight_desc">Bobot Terberat</option>
                        </select>
                    </div>
                </div>

                {/* 2-Column Responsive Layout: Sidebar Filter + Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Filter Sidebar (Desktop) */}
                    <div className={`lg:col-span-3 xl:col-span-3 bg-white p-5 rounded-2xl border border-[#E7E5DF] ${
                        mobileFilterOpen ? 'block' : 'hidden lg:block'
                    }`}>
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E5DF]">
                            <h3 className="font-bold text-sm text-[#1C1917]">Filter Spesifikasi</h3>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="text-xs text-[#C2410C] font-semibold hover:underline"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleApplyFilter} className="space-y-5">
                            {/* Gender Filter */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
                                    Jenis Kelamin
                                </label>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {[
                                        { id: '', label: 'Semua' },
                                        { id: 'male', label: 'Jantan' },
                                        { id: 'female', label: 'Betina' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setSelectedGender(opt.id)}
                                            className={`py-2 rounded-lg font-medium border text-center transition ${
                                                selectedGender === opt.id
                                                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                                                    : 'bg-[#FBFBF9] text-[#57534E] border-[#E7E5DF] hover:border-[#1B4332]'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location / City Filter */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
                                    Kota Asal Peternak
                                </label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full py-2 px-3 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] text-xs font-medium text-[#1C1917]"
                                >
                                    <option value="">Semua Lokasi Kandang</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Weight Filter (kg) */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
                                    Rentang Bobot (kg)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min kg"
                                        value={minWeight}
                                        onChange={(e) => setMinWeight(e.target.value)}
                                        className="py-1.5 px-3 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Maks kg"
                                        value={maxWeight}
                                        onChange={(e) => setMaxWeight(e.target.value)}
                                        className="py-1.5 px-3 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                </div>
                            </div>

                            {/* Price Filter (Rp) */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
                                    Rentang Harga (Rp)
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        placeholder="Harga Minimum (Rp)"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full py-1.5 px-3 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Harga Maksimum (Rp)"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full py-1.5 px-3 rounded-lg border border-[#E7E5DF] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                </div>
                            </div>

                            {/* Submit Filter Button */}
                            <button
                                type="submit"
                                className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold transition shadow-xs"
                            >
                                Terapkan Filter
                            </button>
                        </form>
                    </div>

                    {/* Livestock Grid Area */}
                    <div className="lg:col-span-9 xl:col-span-9">
                        {livestocks.data && livestocks.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {livestocks.data.map((livestock, index) => {
                                        const primaryImage = livestock.images?.[0]?.image_url || '/images/hero-farm.jpg';
                                        return (
                                            <Reveal key={livestock.id} delay={(index % 3) * 80} className="h-full">
                                            <div
                                                className="relative h-full bg-white rounded-2xl overflow-hidden border border-[#E7E5DF] hover:border-[#2D6A4F]/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group focus-within:ring-2 focus-within:ring-[#1B4332]"
                                            >
                                                {/* Image */}
                                                <div className="relative aspect-4/3 overflow-hidden bg-[#F4F2EC]">
                                                    <img
                                                        src={primaryImage}
                                                        alt={livestock.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#1B4332] text-white">
                                                            {livestock.category?.name || 'Ternak'}
                                                        </span>
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#D8F3DC] text-[#1B4332]">
                                                            Bebas PMK
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
                                                        {livestock.weight_kg} kg
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="p-5 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between text-xs text-[#57534E] mb-1.5">
                                                            <span className="font-medium text-[#C2410C]">
                                                                {livestock.breed}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-3.5 h-3.5 text-[#57534E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span>{livestock.seller?.city || 'Indonesia'}</span>
                                                            </span>
                                                        </div>

                                                        <h3 className="font-bold text-base text-[#1C1917] group-hover:text-[#1B4332] transition line-clamp-1 mb-2">
                                                            <Link
                                                                href={`/livestock/${livestock.id}`}
                                                                className="after:absolute after:inset-0 focus:outline-none"
                                                            >
                                                                {livestock.title}
                                                            </Link>
                                                        </h3>

                                                        <div className="grid grid-cols-2 gap-2 text-xs text-[#57534E] bg-[#FBFBF9] p-2.5 rounded-lg mb-4 border border-[#E7E5DF]">
                                                            <div>
                                                                <span className="block text-[11px] text-[#57534E]/80">Jenis Kelamin</span>
                                                                <strong className="text-[#1C1917] font-medium capitalize">
                                                                    {livestock.gender === 'male' ? 'Jantan' : 'Betina'}
                                                                </strong>
                                                            </div>
                                                            <div>
                                                                <span className="block text-[11px] text-[#57534E]/80">Umur Hewan</span>
                                                                <strong className="text-[#1C1917] font-medium">
                                                                    {livestock.age_months} Bulan
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-3 border-t border-[#E7E5DF]">
                                                        <div className="flex items-baseline justify-between mb-3">
                                                            <div>
                                                                <span className="text-[11px] text-[#57534E] block">Harga Peternak</span>
                                                                <span className="text-lg font-bold text-[#1B4332]">
                                                                    {formatCurrency(livestock.price)}
                                                                </span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-[11px] text-[#57534E] block">Estimasi / kg</span>
                                                                <span className="text-xs font-semibold text-[#57534E]">
                                                                    Rp {Math.round(livestock.price / livestock.weight_kg).toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <Link
                                                            href={`/checkout/${livestock.id}`}
                                                            className="relative z-10 w-full block py-2.5 px-3 text-center rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-semibold text-white transition shadow-xs"
                                                        >
                                                            Pesan / Booking Ternak &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            </Reveal>
                                        );
                                    })}
                                </div>

                                {/* Pagination Links */}
                                {livestocks.links && livestocks.links.length > 3 && (
                                    <div className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
                                        {livestocks.links.map((link, idx) => (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
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
                            </>
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-2xl p-12 text-center border border-[#E7E5DF] max-w-lg mx-auto">
                                <div className="text-4xl mb-3">ðŸ”</div>
                                <h3 className="text-lg font-bold text-[#1C1917] mb-1">
                                    Tidak Ada Hewan Ternak yang Cocok
                                </h3>
                                <p className="text-xs text-[#57534E] mb-6">
                                    Coba longgarkan rentang bobot atau harga, atau hapus filter kata kunci pencarian.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
