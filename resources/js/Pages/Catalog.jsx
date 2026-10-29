import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import LivestockCard from "../Components/LivestockCard";
import {
    LivestockCategoryIcon,
    getCategoryImageUrl,
} from "../Components/LivestockIcons";

export default function Catalog({
    livestocks,
    categories = [],
    cities = [],
    filters = {},
}) {
    const [searchQuery, setSearchQuery] = useState(filters.q || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || "",
    );
    const [selectedGender, setSelectedGender] = useState(filters.gender || "");
    const [selectedCity, setSelectedCity] = useState(filters.city || "");
    const [minPrice, setMinPrice] = useState(filters.min_price || "");
    const [maxPrice, setMaxPrice] = useState(filters.max_price || "");
    const [minWeight, setMinWeight] = useState(filters.min_weight || "");
    const [maxWeight, setMaxWeight] = useState(filters.max_weight || "");
    const [selectedSort, setSelectedSort] = useState(filters.sort || "latest");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    const navigateWithParams = (params) => {
        router.get("/katalog", params, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    };

    const handleApplyFilter = (e) => {
        if (e) {
            e.preventDefault();
        }

        const params = {};
        if (searchQuery) {
            params.q = searchQuery;
        }
        if (selectedCategory) {
            params.category = selectedCategory;
        }
        if (selectedGender) {
            params.gender = selectedGender;
        }
        if (selectedCity) {
            params.city = selectedCity;
        }
        if (minPrice) {
            params.min_price = minPrice;
        }
        if (maxPrice) {
            params.max_price = maxPrice;
        }
        if (minWeight) {
            params.min_weight = minWeight;
        }
        if (maxWeight) {
            params.max_weight = maxWeight;
        }
        if (selectedSort && selectedSort !== "latest") {
            params.sort = selectedSort;
        }

        navigateWithParams(params);
        setMobileFilterOpen(false);
    };

    const handleResetFilter = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedGender("");
        setSelectedCity("");
        setMinPrice("");
        setMaxPrice("");
        setMinWeight("");
        setMaxWeight("");
        setSelectedSort("latest");
        navigateWithParams({});
    };

    const handleCategoryClick = (slug) => {
        const nextCat = selectedCategory === slug ? "" : slug;
        setSelectedCategory(nextCat);

        const params = { ...filters };
        if (nextCat) {
            params.category = nextCat;
        } else {
            delete params.category;
        }
        navigateWithParams(params);
    };

    const handleSortChange = (newSort) => {
        setSelectedSort(newSort);
        const params = { ...filters, sort: newSort };
        if (newSort === "latest") {
            delete params.sort;
        }
        navigateWithParams(params);
    };

    const hasActiveFilters = Boolean(
        selectedCategory ||
        selectedGender ||
        selectedCity ||
        minPrice ||
        maxPrice ||
        minWeight ||
        maxWeight ||
        searchQuery,
    );

    const items = livestocks?.data || [];

    return (
        <AppLayout currentRoute="catalog">
            <Head title="Katalog Hewan Ternak Siap Kirim - Segala Jenis Ternak" />

            <div className="w-full bg-[#F4F2EC] border-b border-[#D6D3CB] py-7 sm:py-9">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <nav
                                className="flex items-center gap-2 text-xs font-semibold text-[#57534E] mb-1.5"
                                aria-label="Breadcrumb"
                            >
                                <Link
                                    href="/"
                                    className="hover:text-[#1B4332] hover:underline"
                                >
                                    Beranda
                                </Link>
                                <span>/</span>
                                <span className="text-[#1C1917]">
                                    Katalog Ternak
                                </span>
                            </nav>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                                Katalog Hewan Ternak Siap Kirim
                            </h1>
                            <p className="text-sm text-[#57534E] mt-1">
                                Menampilkan{" "}
                                <strong className="text-[#1C1917] tabular-nums">
                                    {livestocks?.total || 0}
                                </strong>{" "}
                                ekor hewan ternak terverifikasi bobot timbangan
                                dan SKKH.
                            </p>
                        </div>

                        <form
                            onSubmit={handleApplyFilter}
                            className="flex items-center gap-2 max-w-md w-full"
                        >
                            <div className="relative flex-1">
                                <label
                                    htmlFor="catalog-search"
                                    className="sr-only"
                                >
                                    Cari kata kunci ternak
                                </label>
                                <input
                                    id="catalog-search"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari ras (Limousin, Ayam Kampung, Landrace, Garut) atau kota..."
                                    className="min-h-11 w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#78716C] bg-white text-sm text-[#1C1917]"
                                />
                                <svg
                                    className="w-4 h-4 text-[#57534E] absolute left-3.5 top-3.5 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="min-h-11 px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition-colors cursor-pointer"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1 no-scrollbar">
                        <button
                            type="button"
                            onClick={() => handleCategoryClick("")}
                            className={`min-h-11 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-2 cursor-pointer ${
                                !selectedCategory
                                    ? "bg-[#1B4332] text-white border-[#1B4332]"
                                    : "bg-white text-[#1C1917] border-[#78716C] hover:bg-[#FBFBF9]"
                            }`}
                        >
                            <svg
                                className="w-4 h-4 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                            </svg>
                            <span>Semua Hewan</span>
                        </button>
                        {categories.map((cat) => {
                            const imgUrl = getCategoryImageUrl(cat);
                            const isSelected = selectedCategory === cat.slug;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() =>
                                        handleCategoryClick(cat.slug)
                                    }
                                    className={`min-h-11 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-2.5 cursor-pointer ${
                                        isSelected
                                            ? "bg-[#1B4332] text-white border-[#1B4332]"
                                            : "bg-white text-[#1C1917] border-[#78716C] hover:bg-[#FBFBF9]"
                                    }`}
                                >
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt=""
                                            className="w-5.5 h-5.5 rounded-md object-cover border border-[#D6D3CB]/60 shrink-0"
                                        />
                                    ) : (
                                        <span
                                            className={`w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0 ${
                                                isSelected
                                                    ? "bg-white/20 text-white"
                                                    : "bg-[#D8F3DC] text-[#1B4332]"
                                            }`}
                                        >
                                            <LivestockCategoryIcon
                                                slug={cat.icon_url || cat.slug}
                                                className="w-3.5 h-3.5"
                                            />
                                        </span>
                                    )}
                                    <span>{cat.name}</span>
                                    <span
                                        className={`text-[11px] px-1.5 py-0.5 rounded-md tabular-nums ${
                                            isSelected
                                                ? "bg-white/20 text-white"
                                                : "bg-[#F4F2EC] text-[#1C1917]"
                                        }`}
                                    >
                                        {cat.livestocks_count || 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-7 sm:py-8">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#D6D3CB]">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setMobileFilterOpen(!mobileFilterOpen)
                            }
                            aria-expanded={mobileFilterOpen}
                            className="lg:hidden min-h-11 flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#78716C] text-xs font-semibold text-[#1C1917]"
                        >
                            <svg
                                className="w-4 h-4 text-[#1B4332]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            <span>Filter Spesifikasi</span>
                            {hasActiveFilters && (
                                <span className="px-1.5 py-0.5 rounded bg-[#D8F3DC] text-[#1B4332] text-[10px] font-bold">
                                    Aktif
                                </span>
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="min-h-11 px-2 text-xs font-semibold text-[#9A3412] hover:underline cursor-pointer"
                            >
                                Atur Ulang Filter
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <label
                            htmlFor="catalog-sort"
                            className="text-[#57534E] font-medium"
                        >
                            Urutkan:
                        </label>
                        <select
                            id="catalog-sort"
                            value={selectedSort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="min-h-11 py-2 px-3 rounded-xl border border-[#78716C] bg-white text-xs font-semibold text-[#1C1917]"
                        >
                            <option value="latest">Terbaru Ditambahkan</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                            <option value="weight_desc">Bobot Terberat</option>
                        </select>
                    </div>
                </div>

                {isFiltering && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="mb-5 px-4 py-3 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] text-xs font-semibold text-[#1B4332]"
                    >
                        Memuat ulang daftar hewan ternak sesuai filter pilihan
                        Anda...
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    <aside
                        aria-label="Filter spesifikasi ternak"
                        className={`lg:col-span-3 bg-white p-5 rounded-2xl border border-[#D6D3CB] ${
                            mobileFilterOpen ? "block" : "hidden lg:block"
                        }`}
                    >
                        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E7E5DF]">
                            <h2 className="font-bold text-sm text-[#1C1917]">
                                Filter Spesifikasi
                            </h2>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="text-xs text-[#9A3412] font-semibold hover:underline cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        <form
                            onSubmit={handleApplyFilter}
                            className="space-y-5"
                        >
                            <div>
                                <span className="block text-xs font-bold text-[#1C1917] mb-2">
                                    Jenis Kelamin
                                </span>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {[
                                        { id: "", label: "Semua" },
                                        { id: "male", label: "Jantan" },
                                        { id: "female", label: "Betina" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedGender(opt.id)
                                            }
                                            className={`min-h-11 px-2 py-2 rounded-lg font-semibold border text-center transition-colors cursor-pointer ${
                                                selectedGender === opt.id
                                                    ? "bg-[#1B4332] text-white border-[#1B4332]"
                                                    : "bg-[#FBFBF9] text-[#1C1917] border-[#78716C] hover:bg-[#F4F2EC]"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-city"
                                    className="block text-xs font-bold text-[#1C1917] mb-2"
                                >
                                    Kota Asal Kandang
                                </label>
                                <select
                                    id="filter-city"
                                    value={selectedCity}
                                    onChange={(e) =>
                                        setSelectedCity(e.target.value)
                                    }
                                    className="min-h-11 w-full py-2 px-3 rounded-lg border border-[#78716C] bg-[#FBFBF9] text-xs font-medium text-[#1C1917]"
                                >
                                    <option value="">
                                        Semua Lokasi Kandang
                                    </option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-[#1C1917] mb-2">
                                    Rentang Bobot (kg)
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        aria-label="Bobot minimum dalam kg"
                                        placeholder="Min kg"
                                        value={minWeight}
                                        onChange={(e) =>
                                            setMinWeight(e.target.value)
                                        }
                                        className="min-h-11 py-2 px-3 rounded-lg border border-[#78716C] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        aria-label="Bobot maksimum dalam kg"
                                        placeholder="Maks kg"
                                        value={maxWeight}
                                        onChange={(e) =>
                                            setMaxWeight(e.target.value)
                                        }
                                        className="min-h-11 py-2 px-3 rounded-lg border border-[#78716C] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                </div>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-[#1C1917] mb-2">
                                    Rentang Harga (Rp)
                                </span>
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        min="0"
                                        aria-label="Harga minimum dalam Rupiah"
                                        placeholder="Harga Minimum (Rp)"
                                        value={minPrice}
                                        onChange={(e) =>
                                            setMinPrice(e.target.value)
                                        }
                                        className="min-h-11 w-full py-2 px-3 rounded-lg border border-[#78716C] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        aria-label="Harga maksimum dalam Rupiah"
                                        placeholder="Harga Maksimum (Rp)"
                                        value={maxPrice}
                                        onChange={(e) =>
                                            setMaxPrice(e.target.value)
                                        }
                                        className="min-h-11 w-full py-2 px-3 rounded-lg border border-[#78716C] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="min-h-11 w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Terapkan Filter
                            </button>
                        </form>
                    </aside>

                    <div className="lg:col-span-9">
                        {items.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {items.map((livestock) => (
                                        <LivestockCard
                                            key={livestock.id}
                                            livestock={livestock}
                                            contain
                                        />
                                    ))}
                                </div>

                                {livestocks.links &&
                                    livestocks.links.length > 3 && (
                                        <nav
                                            className="mt-10 flex items-center justify-center gap-1.5 flex-wrap"
                                            aria-label="Navigasi halaman katalog"
                                        >
                                            {livestocks.links.map(
                                                (link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={link.url || "#"}
                                                        preserveScroll
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                        className={`min-h-11 inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                                            link.active
                                                                ? "bg-[#1B4332] text-white"
                                                                : link.url
                                                                  ? "bg-white border border-[#78716C] text-[#1C1917] hover:bg-[#F4F2EC]"
                                                                  : "text-[#78716C] border border-[#E7E5DF] pointer-events-none opacity-60"
                                                        }`}
                                                    />
                                                ),
                                            )}
                                        </nav>
                                    )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-[#D6D3CB] max-w-lg mx-auto">
                                <div className="w-12 h-12 rounded-xl bg-[#F4F2EC] text-[#1B4332] flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-[#1C1917] mb-1.5">
                                    Tidak Ada Hewan yang Sesuai Filter
                                </h2>
                                <p className="text-sm text-[#57534E] mb-6">
                                    Pencarian saat ini belum menemukan ternak
                                    dengan kombinasi kategori, rentang bobot,
                                    atau harga tersebut.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="min-h-11 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition-colors cursor-pointer"
                                >
                                    Tampilkan Semua Ternak
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
