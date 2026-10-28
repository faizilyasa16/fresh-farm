<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Fresh Farm - Marketplace Hewan Ternak terpercaya untuk kurban, aqiqah, dan usaha kuliner. Dapatkan sapi, kambing, domba, dan kerbau langsung dari peternak lokal dengan bobot riil dan sertifikat sehat bebas PMK.">
    <meta name="keywords" content="marketplace hewan ternak, sapi kurban, kambing aqiqah, domba garut, peternakan sapi boyolali, harga kambing etawa">
    <title>@yield('title', 'Fresh Farm - Marketplace Hewan Ternak Terpercaya')</title>

    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">

    <!-- Vite Styles and Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        /* Custom earthy tones & shadows compliant with antislop */
        :root {
            --farm-green-dark: #1b4332;
            --farm-green-primary: #2d6a4f;
            --farm-green-light: #d8f3dc;
            --farm-sand-bg: #fbfbf9;
            --farm-sand-surface: #f4f2ec;
            --farm-terracotta: #c2410c;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--farm-sand-bg);
            color: #1c1917;
        }

        /* Subtle natural card border & elevation */
        .card-farm {
            background-color: #ffffff;
            border: 1px solid #e7e5df;
            border-radius: 12px;
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .card-farm:hover {
            transform: translateY(-2px);
            border-color: #cbd5e1;
            box-shadow: 0 8px 24px -4px rgba(27, 67, 50, 0.08);
        }

        /* Focus rings for keyboard navigation (R-32) */
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
            outline: 2px solid #2d6a4f !important;
            outline-offset: 2px !important;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-[#2d6a4f] selection:text-white">

    <!-- Top Announcement Bar (Otentik Informasi Musim Kurban & Pengiriman) -->
    <div class="bg-[#1b4332] text-white text-xs md:text-sm py-2 px-4 border-b border-[#2d6a4f]/40">
        <div class="w-full px-2 sm:px-6 lg:px-10 xl:px-14 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div class="flex items-center gap-2 text-stone-200">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2d6a4f] text-emerald-100">Info Layanan</span>
                <span>Pemesanan Kurban 1447 H / Aqiqah: Gratis penitipan & perawatan pakan di kandang peternak sampai H-1</span>
            </div>
            <div class="flex items-center gap-4 text-xs font-medium text-stone-300">
                <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Semua Hewan Lolos Sertifikasi Bebas PMK
                </span>
                <span class="hidden md:inline text-stone-500">|</span>
                <a href="#katalog" class="hover:text-white underline decoration-emerald-400/60 underline-offset-2">Cek Katalog Hewan</a>
            </div>
        </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-md border-b border-[#e7e5df]">
        <div class="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
            <div class="flex items-center justify-between h-20">
                
                <!-- Logo & Brand -->
                <a href="{{ route('marketplace.index') }}" class="flex items-center gap-3 group">
                    <div class="w-11 h-11 rounded-xl bg-[#1b4332] text-emerald-300 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
                        <!-- Custom authentic leaf & livestock mark -->
                        <svg class="w-7 h-7 text-[#d8f3dc]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 3.84 2.16 7.18 5.34 8.86.35.18.73-.13.68-.52-.39-3.08 1.15-5.96 3.63-7.53C13.43 11.69 15.34 11 17.5 11c.83 0 1.63.1 2.39.29.38.1.72-.21.68-.6C20.25 5.96 16.5 2 12 2zm-1 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                        </svg>
                    </div>
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-xl font-bold tracking-tight text-[#1b4332]">Fresh Farm</span>
                            <span class="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#d8f3dc] text-[#1b4332]">Pasar Ternak</span>
                        </div>
                        <p class="text-[11px] text-[#57534e] font-medium leading-none">Marketplace Ternak Langsung dari Peternak</p>
                    </div>
                </a>

                <!-- Desktop Navigation Links (R-24: Only links to existing sections) -->
                <nav class="hidden md:flex items-center gap-8">
                    <a href="{{ route('marketplace.index') }}#katalog" class="text-sm font-medium text-[#1c1917] hover:text-[#1b4332] transition-colors py-1">Katalog Ternak</a>
                    <a href="{{ route('marketplace.index') }}#kategori" class="text-sm font-medium text-[#57534e] hover:text-[#1b4332] transition-colors py-1">Kategori Hewan</a>
                    <a href="{{ route('marketplace.index') }}#alur-transaksi" class="text-sm font-medium text-[#57534e] hover:text-[#1b4332] transition-colors py-1">Alur Transaksi</a>
                    <a href="{{ route('marketplace.index') }}#jaminan-kesehatan" class="text-sm font-medium text-[#57534e] hover:text-[#1b4332] transition-colors py-1">Garansi Sehat & PMK</a>
                </nav>

                <!-- Actions: Seller Inventory CRUD & Contact -->
                <div class="flex items-center gap-3">
                    <!-- Seller Modal Trigger (PRD Feature B: Manajemen Data Hewan CRUD) -->
                    <button type="button" 
                            onclick="openSellerModal()"
                            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium text-[#1b4332] bg-[#d8f3dc] hover:bg-[#b7e4c7] transition-colors border border-[#74c69d]/40">
                        <svg class="w-4 h-4 text-[#1b4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <span class="font-semibold">Kelola Ternak (Seller)</span>
                    </button>

                    <!-- Primary CTA -->
                    <a href="#katalog" 
                       class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white bg-[#c2410c] hover:bg-[#9a3412] shadow-sm transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span>Cari Ternak</span>
                    </a>
                </div>

            </div>
        </div>
    </header>

    <!-- Flash Notifications / Alerts -->
    @if(session('success'))
        <div class="bg-emerald-50 border-b border-emerald-200 py-3 px-4">
            <div class="w-full px-2 sm:px-6 lg:px-10 xl:px-14 flex items-center justify-between text-emerald-800 text-sm">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    <span>{{ session('success') }}</span>
                </div>
                <button type="button" onclick="this.parentElement.parentElement.remove()" class="text-emerald-700 hover:text-emerald-900 text-xs font-semibold">Tutup</button>
            </div>
        </div>
    @endif

    @if(session('order_success'))
        @php $orderData = session('order_success'); @endphp
        <div class="bg-amber-50 border-b border-amber-200 py-4 px-4">
            <div class="w-full px-2 sm:px-6 lg:px-10 xl:px-14 flex flex-col md:flex-row md:items-center justify-between gap-3 text-stone-800">
                <div class="flex items-start gap-3">
                    <div class="p-2 bg-amber-100 rounded-lg text-amber-800 mt-0.5">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <h4 class="font-semibold text-stone-900 text-base">Pesanan #{{ $orderData['order_id'] }} Berhasil Dibuat!</h4>
                        <p class="text-sm text-stone-600">Hewan <strong class="text-stone-900">{{ $orderData['livestock_title'] }}</strong> telah otomatis di-booking untuk Anda. Total: <strong>Rp {{ number_format($orderData['total_amount'], 0, ',', '.') }}</strong></p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <a href="{{ $orderData['whatsapp_url'] }}" target="_blank" rel="noopener noreferrer" 
                       class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                        <span>Buka Chat WhatsApp Peternak</span>
                    </a>
                </div>
            </div>
        </div>
    @endif

    <!-- Main Page Content -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-[#1b4332] text-stone-200 mt-20 border-t border-[#2d6a4f]/50">
        <div class="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-14">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
                
                <!-- Brand Column -->
                <div class="space-y-4 md:col-span-1">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#2d6a4f] text-[#d8f3dc] flex items-center justify-center font-bold">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12c0 3.84 2.16 7.18 5.34 8.86.35.18.73-.13.68-.52-.39-3.08 1.15-5.96 3.63-7.53C13.43 11.69 15.34 11 17.5 11c.83 0 1.63.1 2.39.29.38.1.72-.21.68-.6C20.25 5.96 16.5 2 12 2zm-1 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                            </svg>
                        </div>
                        <span class="text-xl font-bold tracking-tight text-white">Fresh Farm</span>
                    </div>
                    <p class="text-xs text-stone-300 leading-relaxed">
                        Platform marketplace hewan ternak terverifikasi yang mempertemukan peternak lokal Jawa & Nusantara langsung dengan pembeli individu, panitia kurban, dan pengusaha kuliner.
                    </p>
                    <div class="pt-1 text-xs text-stone-400">
                        <p>Kandang Mitra Terverifikasi: Boyolali, Sukoharjo, Bogor, Garut, Sukabumi, Wonosobo.</p>
                    </div>
                </div>

                <!-- Navigation Quick Links -->
                <div>
                    <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navigasi Utama</h3>
                    <ul class="space-y-2.5 text-xs text-stone-300">
                        <li><a href="#katalog" class="hover:text-emerald-300 transition-colors">Katalog Sapi & Kambing</a></li>
                        <li><a href="#kategori" class="hover:text-emerald-300 transition-colors">Kategori Ternak</a></li>
                        <li><a href="#alur-transaksi" class="hover:text-emerald-300 transition-colors">Alur Pemesanan & Kirim</a></li>
                        <li><a href="#jaminan-kesehatan" class="hover:text-emerald-300 transition-colors">Sertifikasi & Bebas PMK</a></li>
                    </ul>
                </div>

                <!-- Layanan Ternak -->
                <div>
                    <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Kebutuhan Ternak</h3>
                    <ul class="space-y-2.5 text-xs text-stone-300">
                        <li><span>Kurban Idul Adha (Sapi Limousin & Simental)</span></li>
                        <li><span>Aqiqah Siap Potong (Kambing & Domba)</span></li>
                        <li><span>Suplai Restoran & Katering Sate</span></li>
                        <li><span>Pengiriman Khusus Armada Ternak Berpengalaman</span></li>
                    </ul>
                </div>

                <!-- Hubungi Mitra & Jam Operasional -->
                <div>
                    <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Layanan Pembeli & Peternak</h3>
                    <div class="space-y-2 text-xs text-stone-300">
                        <p><strong class="text-white">Jam Kunjungan Kandang:</strong></p>
                        <p>Senin - Minggu: 07.30 - 17.00 WIB</p>
                        <p class="pt-2"><strong class="text-white">Layanan Chat / WhatsApp:</strong></p>
                        <p>Responsif setiap hari untuk survei kandang & video call cek fisik ternak.</p>
                    </div>
                </div>

            </div>

            <div class="border-t border-[#2d6a4f]/40 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400">
                <p>&copy; {{ date('Y') }} Fresh Farm. Hak cipta dilindungi undang-undang.</p>
                <p class="mt-2 sm:mt-0">Dirancang khusus untuk ekosistem peternak Indonesia.</p>
            </div>
        </div>
    </footer>

    <!-- Global Seller Management Modal (CRUD) -->
    @include('marketplace.partials.seller-modal')

    <!-- Global Product Detail Modal -->
    @include('marketplace.partials.detail-modal')

    <!-- Global Order / Checkout Modal -->
    @include('marketplace.partials.order-modal')

    @stack('scripts')
</body>
</html>
