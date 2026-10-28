@extends('layouts.app')

@section('title', 'Fresh Farm - Marketplace Hewan Ternak Kurban & Aqiqah Terpercaya')

@section('content')

<!-- 1. HERO SECTION (PRD 4.A.1) -->
<section class="relative bg-[#1b4332] text-white overflow-hidden">
    <!-- Background Image with Natural Tint (NO purple gradient) -->
    <div class="absolute inset-0 z-0">
        <img src="/images/hero-farm.jpg" alt="Peternakan Hewan Ternak Indonesia" class="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity">
        <div class="absolute inset-0 bg-gradient-to-r from-[#0f241a]/95 via-[#1b4332]/85 to-[#2d6a4f]/75"></div>
    </div>

    <div class="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-14 sm:py-20 lg:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <!-- Left Column: Headline, Search, Trust Points -->
            <div class="lg:col-span-7 xl:col-span-8 space-y-6">
                <!-- Category Tagline (Otentik, membumi, bukan buzzword AI) -->
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2d6a4f]/80 border border-emerald-400/30 text-emerald-100 text-xs font-semibold">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Pasar Hewan Ternak Sehat & Bersertifikat Resmi</span>
                </div>

                <!-- Headline H1 -->
                <h1 class="text-3xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight">
                    Marketplace Hewan Ternak Langsung dari Peternak Lokal
                </h1>

                <!-- Subtitle -->
                <p class="text-base sm:text-lg text-stone-200 leading-relaxed font-normal max-w-3xl">
                    Cari sapi kurban, kambing aqiqah, domba priangan, dan kerbau jantan dengan spesifikasi bobot hidup riil, riwayat pakan transparan, dan sertifikat bebas PMK dari peternak terpercaya di Boyolali, Bogor, dan Garut.
                </p>

                <!-- Search Form Bar -->
                <form action="{{ route('marketplace.index') }}#katalog" method="GET" class="bg-white p-2 sm:p-2.5 rounded-xl shadow-xl flex flex-col sm:flex-row gap-2 max-w-3xl border border-stone-200">
                    <div class="flex-grow flex items-center px-3 gap-2">
                        <svg class="w-5 h-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" name="q" value="{{ $keyword }}" 
                               placeholder="Cari ras hewan, misal: Limousin, Etawa, Garut, atau kota..." 
                               class="w-full text-sm text-stone-900 placeholder:text-stone-400 border-0 focus:ring-0 py-2">
                    </div>
                    <div class="flex items-center gap-2">
                        <select name="city" class="text-xs sm:text-sm text-stone-700 font-medium bg-stone-50 border-0 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-[#2d6a4f]">
                            <option value="">Semua Lokasi Kandang</option>
                            @foreach($cities as $city)
                                <option value="{{ $city }}" {{ $selectedCity === $city ? 'selected' : '' }}>{{ $city }}</option>
                            @endforeach
                        </select>
                        <button type="submit" class="w-full sm:w-auto px-6 py-2.5 bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                            <span>Cari</span>
                        </button>
                    </div>
                </form>

                <!-- Genuine Trust Points (PRD Objectives) -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs text-stone-200 max-w-3xl">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center text-emerald-200 shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                        </div>
                        <span class="font-medium">Timbang Hidup Riil</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center text-emerald-200 shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <span class="font-medium">Vaksin PMK & SKKH</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center text-emerald-200 shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </div>
                        <span class="font-medium">Video Call Cek Ternak</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center text-emerald-200 shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        </div>
                        <span class="font-medium">Armada Khusus Antar</span>
                    </div>
                </div>
            </div>

            <!-- Right Column: Featured Livestock Spotlight Card on Desktop -->
            @php $spotlight = $livestocks->first(); @endphp
            @if($spotlight)
                <div class="hidden lg:block lg:col-span-5 xl:col-span-4">
                    <div class="bg-white/95 text-stone-900 rounded-2xl p-6 shadow-2xl border border-emerald-500/20 backdrop-blur-md">
                        <div class="flex items-center justify-between mb-3">
                            <span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#d8f3dc] text-[#1b4332] uppercase tracking-wider">
                                Rekomendasi Pekan Ini
                            </span>
                            <span class="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Siap Kirim
                            </span>
                        </div>
                        
                        <div class="relative rounded-xl overflow-hidden aspect-[16/10] bg-stone-100 mb-4 border border-stone-200">
                            <img src="{{ $spotlight->primary_image_url }}" alt="{{ $spotlight->title }}" class="w-full h-full object-cover">
                            <div class="absolute bottom-2.5 left-2.5">
                                <span class="px-2.5 py-1 rounded bg-[#1b4332]/90 text-white text-xs font-bold shadow-xs">
                                    {{ $spotlight->category->name }} {{ $spotlight->breed }}
                                </span>
                            </div>
                        </div>

                        <h3 class="font-bold text-stone-900 text-base leading-snug line-clamp-1 mb-2">
                            {{ $spotlight->title }}
                        </h3>

                        <div class="grid grid-cols-3 gap-2 p-2.5 bg-[#fbfbf9] rounded-lg border border-stone-200 text-xs mb-4">
                            <div>
                                <span class="text-stone-500 block text-[10px] uppercase font-semibold">Bobot</span>
                                <strong class="text-stone-900 font-bold">{{ $spotlight->weight_kg }} kg</strong>
                            </div>
                            <div>
                                <span class="text-stone-500 block text-[10px] uppercase font-semibold">Umur</span>
                                <strong class="text-stone-900 font-bold">{{ $spotlight->age_months }} Bln</strong>
                            </div>
                            <div>
                                <span class="text-stone-500 block text-[10px] uppercase font-semibold">Kandang</span>
                                <strong class="text-stone-900 font-bold truncate block">{{ $spotlight->seller->city ?? 'Boyolali' }}</strong>
                            </div>
                        </div>

                        <div class="flex items-center justify-between pt-1">
                            <div>
                                <span class="text-[10px] text-stone-500 uppercase font-semibold block">Harga Hidup</span>
                                <span class="text-xl font-bold text-[#c2410c]">{{ $spotlight->formatted_price }}</span>
                            </div>
                            <button type="button" 
                                    onclick="openDetailModal({{ json_encode($spotlight) }})"
                                    class="px-4 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                                Lihat Rincian
                            </button>
                        </div>
                    </div>
                </div>
            @endif

        </div>
    </div>
</section>

<!-- 2. QUICK CATEGORY FILTER (Kategori Cepat - PRD 4.A.1) -->
<section id="kategori" class="bg-[#f4f2ec] border-b border-[#e7e5df] py-8">
    <div class="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
                <h2 class="text-lg font-bold text-stone-900 tracking-tight">Kategori Cepat Hewan Ternak</h2>
                <p class="text-xs text-stone-600">Pilih jenis hewan ternak sesuai kebutuhan kurban, aqiqah, atau budidaya</p>
            </div>
            @if($activeCategory || $keyword || $selectedCity || $selectedGender || $minPrice || $maxPrice || $minWeight || $maxWeight)
                <a href="{{ route('marketplace.index') }}" class="text-xs font-semibold text-[#c2410c] hover:underline flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    <span>Reset Semua Filter</span>
                </a>
            @endif
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <!-- All Animals Option -->
            <a href="{{ route('marketplace.index', array_merge(request()->except(['category', 'page']), [])) }}" 
               class="p-4 rounded-xl border text-center transition-all {{ empty($activeCategory) ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-sm' : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400' }}">
                <div class="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 {{ empty($activeCategory) ? 'bg-[#2d6a4f] text-[#d8f3dc]' : 'bg-stone-100 text-stone-600' }}">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                </div>
                <h3 class="text-sm font-bold">Semua Hewan</h3>
                <span class="text-[11px] block mt-0.5 {{ empty($activeCategory) ? 'text-emerald-200' : 'text-stone-500' }}">
                    {{ $livestocks->total() }} Tersedia
                </span>
            </a>

            <!-- Categories -->
            @foreach($categories as $cat)
                @php $isSelected = ($activeCategory === $cat->slug); @endphp
                <a href="{{ route('marketplace.index', array_merge(request()->except(['category', 'page']), ['category' => $cat->slug])) }}" 
                   class="p-4 rounded-xl border text-center transition-all {{ $isSelected ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-sm' : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400' }}">
                    
                    <div class="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 {{ $isSelected ? 'bg-[#2d6a4f] text-[#d8f3dc]' : 'bg-stone-100 text-stone-700' }}">
                        @if($cat->slug === 'sapi')
                            <!-- Cow Icon -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.5 8.5c-.83 0-1.5-.67-1.5-1.5V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V7c0 .83-.67 1.5-1.5 1.5zm-15 0c-.83 0-1.5-.67-1.5-1.5V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V7c0 .83-.67 1.5-1.5 1.5zM12 4c3.87 0 7 3.13 7 7 0 2.38-1.19 4.47-3 5.74V20H8v-3.26C6.19 15.47 5 13.38 5 11c0-3.87 3.13-7 7-7zm0 2c-2.76 0-5 2.24-5 5 0 1.94 1.11 3.63 2.74 4.46l.26.13V18h4v-2.41l.26-.13C15.89 14.63 17 12.94 17 11c0-2.76-2.24-5-5-5z"/>
                            </svg>
                        @elseif($cat->slug === 'kambing')
                            <!-- Goat Icon -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C7.58 2 4 5.58 4 10c0 2.05.78 3.91 2.06 5.34L6 20h3l.5-2h5l.5 2h3l-.06-4.66C19.22 13.91 20 12.05 20 10c0-4.42-3.58-8-8-8zm-1 5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                            </svg>
                        @elseif($cat->slug === 'domba')
                            <!-- Sheep Icon -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 10c-.3 0-.58.05-.85.13C17.5 7.74 15.02 6 12 6c-2.45 0-4.54 1.16-5.59 2.89-.4-.55-1.04-.89-1.76-.89-1.29 0-2.33 1.04-2.33 2.33 0 .28.05.54.14.78C1.52 11.75 1 12.82 1 14c0 2.21 1.79 4 4 4h14c2.21 0 4-1.79 4-4 0-2.21-1.79-4-4-4z"/>
                            </svg>
                        @else
                            <!-- Buffalo Icon -->
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4 21h4l1.2-2.4c.88.26 1.82.4 2.8.4s1.92-.14 2.8-.4L16 21h4l-1.97-3.39C19.26 16.07 20 14.12 20 12c0-4.97-4.03-9-9-9z"/>
                            </svg>
                        @endif
                    </div>

                    <h3 class="text-sm font-bold">{{ $cat->name }}</h3>
                    <span class="text-[11px] block mt-0.5 {{ $isSelected ? 'text-emerald-200' : 'text-stone-500' }}">
                        {{ $cat->livestocks_count }} Ekor Siap Jual
                    </span>
                </a>
            @endforeach
        </div>
    </div>
</section>

<!-- 3. ADVANCED SEARCH, FILTER, AND SORTING TOOLBAR (PRD 4.A.2) -->
<section id="katalog" class="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-10 pb-4">
    <div class="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
        <form action="{{ route('marketplace.index') }}#katalog" method="GET" id="filterForm">
            @if($activeCategory)
                <input type="hidden" name="category" value="{{ $activeCategory }}">
            @endif

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <!-- Keyword -->
                <div>
                    <label for="filter_q" class="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Kata Kunci</label>
                    <input type="text" name="q" id="filter_q" value="{{ $keyword }}" 
                           placeholder="Misal: Limousin, Priangan..."
                           class="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-[#2d6a4f] focus:border-[#2d6a4f]">
                </div>

                <!-- Gender -->
                <div>
                    <label for="filter_gender" class="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Jenis Kelamin</label>
                    <select name="gender" id="filter_gender" onchange="this.form.submit()" 
                            class="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-[#2d6a4f] focus:border-[#2d6a4f]">
                        <option value="">Semua (Jantan & Betina)</option>
                        <option value="male" {{ $selectedGender === 'male' ? 'selected' : '' }}>Jantan (Sah Kurban/Aqiqah)</option>
                        <option value="female" {{ $selectedGender === 'female' ? 'selected' : '' }}>Betina</option>
                    </select>
                </div>

                <!-- City / Location -->
                <div>
                    <label for="filter_city" class="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Lokasi Kandang Peternak</label>
                    <select name="city" id="filter_city" onchange="this.form.submit()" 
                            class="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-[#2d6a4f] focus:border-[#2d6a4f]">
                        <option value="">Semua Wilayah</option>
                        @foreach($cities as $city)
                            <option value="{{ $city }}" {{ $selectedCity === $city ? 'selected' : '' }}>{{ $city }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Min Weight (kg) -->
                <div>
                    <label for="filter_min_weight" class="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Bobot Minimal (kg)</label>
                    <input type="number" name="min_weight" id="filter_min_weight" value="{{ $minWeight }}" 
                           placeholder="Contoh: 50"
                           class="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-[#2d6a4f] focus:border-[#2d6a4f]">
                </div>

                <!-- Sorting (PRD 4.A.2: Pengurutan) -->
                <div>
                    <label for="filter_sort" class="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Urutkan Berdasarkan</label>
                    <select name="sort" id="filter_sort" onchange="this.form.submit()" 
                            class="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 font-medium text-stone-800 focus:ring-1 focus:ring-[#2d6a4f] focus:border-[#2d6a4f]">
                        <option value="latest" {{ $activeSort === 'latest' ? 'selected' : '' }}>Terbaru Ditambahkan</option>
                        <option value="price_asc" {{ $activeSort === 'price_asc' ? 'selected' : '' }}>Harga Terendah</option>
                        <option value="price_desc" {{ $activeSort === 'price_desc' ? 'selected' : '' }}>Harga Tertinggi</option>
                        <option value="weight_desc" {{ $activeSort === 'weight_desc' ? 'selected' : '' }}>Bobot Terberat (Jumbo)</option>
                    </select>
                </div>

            </div>

            <!-- Filter Action Row -->
            <div class="flex items-center justify-between pt-4 mt-4 border-t border-stone-100 text-xs">
                <span class="text-stone-500 font-medium">
                    Menampilkan <strong>{{ $livestocks->total() }}</strong> hewan ternak terverifikasi
                </span>
                <div class="flex items-center gap-2">
                    <a href="{{ route('marketplace.index') }}" class="px-3 py-1.5 text-stone-500 hover:text-stone-800 font-medium">
                        Reset Filter
                    </a>
                    <button type="submit" class="px-4 py-1.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-semibold rounded-md transition-colors">
                        Terapkan Filter
                    </button>
                </div>
            </div>
        </form>
    </div>
</section>

<!-- 4. PRODUCT GRID (Daftar Produk Hewan Ternak - PRD 4.A.1) -->
<section class="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
    @if($livestocks->count() > 0)
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            @foreach($livestocks as $item)
                <div class="card-farm flex flex-col justify-between overflow-hidden group">
                    
                    <div>
                        <!-- Animal Photo with Badges -->
                        <div class="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                            <img src="{{ $item->primary_image_url }}" 
                                 alt="{{ $item->title }}" 
                                 class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
                            
                            <!-- Badges -->
                            <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#1b4332] text-white shadow-xs">
                                    {{ $item->category->name }}
                                </span>
                                <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/95 text-stone-800 shadow-xs border border-stone-200">
                                    {{ $item->breed }}
                                </span>
                            </div>

                            <!-- Gender Tag -->
                            <div class="absolute top-2.5 right-2.5">
                                <span class="px-2 py-0.5 rounded text-[11px] font-bold shadow-xs {{ $item->gender === 'male' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-pink-100 text-pink-900' }}">
                                    {{ $item->gender === 'male' ? 'Jantan' : 'Betina' }}
                                </span>
                            </div>
                        </div>

                        <!-- Card Content -->
                        <div class="p-4">
                            <!-- Title -->
                            <h3 class="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] mb-2" title="{{ $item->title }}">
                                {{ $item->title }}
                            </h3>

                            <!-- Specifications Grid (Bobot riil & Umur) -->
                            <div class="grid grid-cols-2 gap-2 my-3 p-2.5 bg-[#fbfbf9] rounded-lg border border-stone-200 text-xs">
                                <div>
                                    <span class="text-stone-500 block text-[10px] uppercase font-semibold">Bobot Riil</span>
                                    <strong class="text-stone-900 font-bold text-sm">{{ $item->weight_kg }} kg</strong>
                                </div>
                                <div>
                                    <span class="text-stone-500 block text-[10px] uppercase font-semibold">Umur</span>
                                    <strong class="text-stone-900 font-bold text-sm">{{ $item->age_months }} Bulan</strong>
                                </div>
                            </div>

                            <!-- Health Status -->
                            <div class="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 mb-3 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                                <span class="truncate">{{ $item->health_status }}</span>
                            </div>

                            <!-- Barn Location & Breeder -->
                            <div class="text-xs text-stone-600 flex items-center justify-between pb-3 border-b border-stone-100">
                                <span class="flex items-center gap-1 truncate" title="{{ $item->seller->city ?? 'Lokasi Kandang' }}">
                                    <svg class="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    <span class="font-medium text-stone-700">{{ $item->seller->city ?? 'Jawa Tengah' }}</span>
                                </span>
                                <span class="text-[11px] text-stone-500 truncate max-w-[120px]" title="{{ $item->seller->name ?? '' }}">
                                    {{ $item->seller->name ?? 'Peternak' }}
                                </span>
                            </div>

                            <!-- Price -->
                            <div class="pt-3">
                                <span class="text-[10px] text-stone-500 uppercase font-semibold block">Harga Ternak</span>
                                <p class="text-lg sm:text-xl font-bold text-[#c2410c]">
                                    {{ $item->formatted_price }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Card Actions (R-26: All buttons work!) -->
                    <div class="p-4 pt-0 grid grid-cols-2 gap-2">
                        <!-- Detail Modal Button -->
                        <button type="button" 
                                onclick="openDetailModal({{ json_encode($item) }})"
                                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors">
                            Cek Fisik & Detail
                        </button>

                        <!-- Order Checkout Modal Button -->
                        <button type="button" 
                                onclick="openOrderModal({{ json_encode($item) }})"
                                class="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#1b4332] hover:bg-[#2d6a4f] transition-colors shadow-2xs">
                            Pesan Sekarang
                        </button>
                    </div>

                </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-10">
            {{ $livestocks->links() }}
        </div>

    @else
        <!-- R-27: Honest Empty State with action to reset -->
        <div class="p-12 text-center bg-white rounded-2xl border border-stone-200 shadow-2xs max-w-lg mx-auto my-12">
            <div class="w-16 h-16 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-stone-900 mb-1">Tidak Ada Hewan Ternak yang Cocok</h3>
            <p class="text-xs text-stone-600 leading-relaxed mb-6">
                Belum ada listing hewan ternak yang sesuai dengan kombinasi filter Anda saat ini. Cobalah kurangi filter atau reset pencarian.
            </p>
            <a href="{{ route('marketplace.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b4332] text-white text-xs font-bold rounded-lg hover:bg-[#2d6a4f] transition-colors">
                <span>Reset Semua Filter</span>
            </a>
        </div>
    @endif
</section>

<!-- 5. ALUR TRANSAKSI & JAMINAN KESEHATAN (PRD 4 & PRD 6) -->
<section id="alur-transaksi" class="bg-[#f4f2ec] border-t border-[#e7e5df] py-16 mt-12">
    <div class="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        
        <div class="text-center max-w-3xl mx-auto mb-12">
            <span class="text-xs font-bold text-[#2d6a4f] uppercase tracking-wider">Transparan & Terpercaya</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">Alur Transaksi & Jaminan Hewan Ternak</h2>
            <p class="text-xs sm:text-sm text-stone-600 mt-2">
                Tanpa perlu survei kandang satu per satu, nikmati alur transaksi langsung yang aman antara peternak dan pembeli.
            </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div class="bg-white p-6 rounded-xl border border-stone-200">
                <div class="w-10 h-10 rounded-lg bg-[#d8f3dc] text-[#1b4332] font-bold flex items-center justify-center text-sm mb-4">
                    1
                </div>
                <h3 class="font-bold text-stone-900 text-sm mb-1.5">Pilih Ternak & Spesifikasi</h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                    Lihat foto riil hewan, bobot hidup timbang, umur bulan, dan jenis pakan harian peternak.
                </p>
            </div>

            <div class="bg-white p-6 rounded-xl border border-stone-200">
                <div class="w-10 h-10 rounded-lg bg-[#d8f3dc] text-[#1b4332] font-bold flex items-center justify-center text-sm mb-4">
                    2
                </div>
                <h3 class="font-bold text-stone-900 text-sm mb-1.5">Video Call Cek Fisik</h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                    Hubungi peternak via WhatsApp untuk video call langsung melihat hewan berdiri, makan, dan cek fisik bebas cacat.
                </p>
            </div>

            <div class="bg-white p-6 rounded-xl border border-stone-200">
                <div class="w-10 h-10 rounded-lg bg-[#d8f3dc] text-[#1b4332] font-bold flex items-center justify-center text-sm mb-4">
                    3
                </div>
                <h3 class="font-bold text-stone-900 text-sm mb-1.5">Pilih Pengiriman atau Ambil</h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                    Ambil sendiri di kandang tanpa biaya kirim, atau gunakan armada pengiriman khusus ternak beratap dan berterpal aman.
                </p>
            </div>

            <div class="bg-white p-6 rounded-xl border border-stone-200">
                <div class="w-10 h-10 rounded-lg bg-[#d8f3dc] text-[#1b4332] font-bold flex items-center justify-center text-sm mb-4">
                    4
                </div>
                <h3 class="font-bold text-stone-900 text-sm mb-1.5">Serah Terima & Garansi</h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                    Hewan diantar hidup dan sehat bersama dokumen Surat Keterangan Kesehatan Hewan (SKKH) resmi dari Dinas Peternakan.
                </p>
            </div>

        </div>

    </div>
</section>

<!-- 6. SECTION JAMINAN KESEHATAN & VAKSINASI PMK -->
<section id="jaminan-kesehatan" class="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
    <div class="bg-[#1b4332] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-[#2d6a4f]">
        <div class="max-w-4xl relative z-10">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-[#2d6a4f] text-emerald-100 mb-4">
                <svg class="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                Pemeriksaan Dokter Hewan Berkala
            </span>
            <h2 class="text-2xl sm:text-3xl font-bold leading-tight mb-4">
                Bebas Penyakit Mulut & Kuku (PMK) dan Lumpy Skin Disease (LSD)
            </h2>
            <p class="text-xs sm:text-sm text-stone-200 leading-relaxed mb-6">
                Seluruh peternak mitra Fresh Farm wajib mencatatkan riwayat vaksinasi dan surat izin lalu lintas ternak. Kami memastikan hewan yang Anda beli untuk ibadah kurban maupun aqiqah memenuhi syarat sah fiqih syariat dan standar kesehatan veteriner.
            </p>
            <div class="flex flex-wrap gap-4 text-xs font-semibold">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Vaksin PMK Dosis 1 & 2</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>SKKH Dokter Hewan Resmi</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Karantina & Pengawasan Kandang</span>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection

@push('scripts')
<script>
    let currentSelectedAnimal = null;

    // Open Product Detail Modal
    function openDetailModal(animal) {
        currentSelectedAnimal = animal;

        document.getElementById('modalTitle').innerText = animal.title;
        document.getElementById('modalImage').src = animal.primary_image_url || '/images/hero-farm.jpg';
        document.getElementById('modalCategoryBadge').innerText = animal.category ? animal.category.name : 'Ternak';
        document.getElementById('modalBreedText').innerText = 'Ras: ' + (animal.breed || '-');
        document.getElementById('modalWeight').innerText = animal.weight_kg + ' kg';
        document.getElementById('modalAge').innerText = animal.age_months + ' Bulan';
        document.getElementById('modalGender').innerText = animal.gender === 'male' ? 'Jantan' : 'Betina';
        document.getElementById('modalStock').innerText = animal.stock + ' Ekor';
        document.getElementById('modalPrice').innerText = 'Rp ' + Number(animal.price).toLocaleString('id-ID');
        document.getElementById('modalHealthStatus').innerText = animal.health_status || 'Sehat Bebas PMK';
        document.getElementById('modalDescription').innerText = animal.description || 'Hewan sehat prima, nafsu makan bagus, perawatan teratur di kandang mitra Fresh Farm.';

        const seller = animal.seller || {};
        document.getElementById('modalSellerName').innerText = seller.name || 'Peternak Mitra';
        document.getElementById('modalSellerAddress').innerText = (seller.address || '') + (seller.city ? ', ' + seller.city : '');
        document.getElementById('modalSellerBarn').innerHTML = '<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg> <span>' + (seller.name || 'Kandang') + ' (' + (seller.city || 'Indonesia') + ')</span>';
        document.getElementById('modalSellerInitial').innerText = (seller.name ? seller.name.charAt(0) : 'P');

        // Setup WhatsApp link
        let rawPhone = seller.phone_number || '081234567890';
        let cleanPhone = rawPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        }
        const textMsg = encodeURIComponent("Halo " + (seller.name || 'Peternak') + ", saya tertarik dengan " + animal.title + " (Bobot: " + animal.weight_kg + "kg, Harga: Rp " + Number(animal.price).toLocaleString('id-ID') + ") di Fresh Farm. Apakah bisa cek video call?");
        document.getElementById('modalWhatsAppBtn').href = "https://wa.me/" + cleanPhone + "?text=" + textMsg;

        document.getElementById('detailModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeDetailModal() {
        document.getElementById('detailModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function proceedToOrderFromDetail() {
        closeDetailModal();
        if (currentSelectedAnimal) {
            openOrderModal(currentSelectedAnimal);
        }
    }

    // Open Order Modal
    function openOrderModal(animal) {
        currentSelectedAnimal = animal;

        document.getElementById('orderLivestockId').value = animal.id;
        document.getElementById('orderAnimalTitle').innerText = animal.title;
        document.getElementById('orderAnimalImage').src = animal.primary_image_url || '/images/hero-farm.jpg';
        document.getElementById('orderAnimalWeight').innerText = animal.weight_kg + ' kg';
        document.getElementById('orderAnimalSeller').innerText = (animal.seller ? animal.seller.name : 'Peternak');
        document.getElementById('orderAnimalPriceFormatted').innerText = 'Rp ' + Number(animal.price).toLocaleString('id-ID');
        document.getElementById('orderBasePrice').value = animal.price;
        
        const catSlug = animal.category ? animal.category.slug : 'sapi';
        document.getElementById('orderAnimalCategory').value = catSlug;

        const isBigAnimal = (catSlug === 'sapi' || catSlug === 'kerbau');
        document.getElementById('orderCourierPriceText').innerText = isBigAnimal ? '+Rp 650.000' : '+Rp 350.000';

        updateOrderTotals();

        document.getElementById('orderModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeOrderModal() {
        document.getElementById('orderModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function updateOrderTotals() {
        const basePrice = Number(document.getElementById('orderBasePrice').value) || 0;
        const catSlug = document.getElementById('orderAnimalCategory').value;
        const deliveryMethod = document.querySelector('input[name="delivery_method"]:checked')?.value || 'pickup';
        
        const isBigAnimal = (catSlug === 'sapi' || catSlug === 'kerbau');
        const courierCost = isBigAnimal ? 650000 : 350000;
        const shippingCost = (deliveryMethod === 'courier') ? courierCost : 0;
        const totalPrice = basePrice + shippingCost;

        document.getElementById('orderSummaryBasePrice').innerText = 'Rp ' + basePrice.toLocaleString('id-ID');
        document.getElementById('orderSummaryShippingPrice').innerText = 'Rp ' + shippingCost.toLocaleString('id-ID') + (deliveryMethod === 'pickup' ? ' (Ambil di Kandang)' : ' (Armada Ternak)');
        document.getElementById('orderSummaryTotalPrice').innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
    }

    // Seller CRUD Modal Functions
    function openSellerModal() {
        document.getElementById('sellerModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeSellerModal() {
        document.getElementById('sellerModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function switchSellerTab(tab) {
        const tabCreate = document.getElementById('sellerTabCreate');
        const tabList = document.getElementById('sellerTabList');
        const btnCreate = document.getElementById('tabBtnCreate');
        const btnList = document.getElementById('tabBtnList');

        if (tab === 'create') {
            tabCreate.classList.remove('hidden');
            tabList.classList.add('hidden');
            btnCreate.className = 'px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-[#1b4332] text-[#1b4332] transition-colors';
            btnList.className = 'px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition-colors';
        } else {
            tabCreate.classList.add('hidden');
            tabList.classList.remove('hidden');
            btnList.className = 'px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-[#1b4332] text-[#1b4332] transition-colors';
            btnCreate.className = 'px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition-colors';
        }
    }

    // Keyboard support: Escape closes modals (R-32)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDetailModal();
            closeOrderModal();
            closeSellerModal();
        }
    });
</script>
@endpush
