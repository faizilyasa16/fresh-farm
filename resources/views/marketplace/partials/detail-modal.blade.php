<!-- Modal Detail Hewan Ternak (PRD 4.A.3) -->
<div id="detailModal" class="fixed inset-0 z-50 hidden overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all my-8 max-h-[90vh] flex flex-col">
        
        <!-- Header Modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#fbfbf9]">
            <div class="flex items-center gap-2">
                <span id="modalCategoryBadge" class="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#d8f3dc] text-[#1b4332] uppercase tracking-wide">
                    Sapi
                </span>
                <span id="modalBreedText" class="text-xs text-stone-500 font-medium">Ras Limousin</span>
            </div>
            <button type="button" onclick="closeDetailModal()" class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                <span class="sr-only">Tutup</span>
            </button>
        </div>

        <!-- Body Scrollable -->
        <div class="p-6 overflow-y-auto space-y-6">
            
            <!-- Foto Utama & Status -->
            <div class="relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200 aspect-[16/9] sm:aspect-[2/1]">
                <img id="modalImage" src="" alt="Foto Hewan Ternak" class="w-full h-full object-cover">
                <div class="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span id="modalStatusBadge" class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-emerald-600 text-white">
                        Tersedia
                    </span>
                    <span id="modalHealthStatus" class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-[#1b4332] text-emerald-200">
                        Vaksin PMK Lengkap
                    </span>
                </div>
            </div>

            <!-- Judul & Harga -->
            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                    <h3 id="modalTitle" class="text-xl sm:text-2xl font-bold text-stone-900 leading-snug"></h3>
                    <p id="modalSellerBarn" class="text-sm text-stone-600 mt-1 flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        <span>Kandang Berkah, Boyolali</span>
                    </p>
                </div>
                <div class="text-left sm:text-right">
                    <p class="text-xs text-stone-500 font-medium">Harga Ternak Hidup</p>
                    <p id="modalPrice" class="text-2xl font-bold text-[#c2410c]"></p>
                </div>
            </div>

            <!-- Tabel Spesifikasi Detail (Bobot, Umur, Jenis Kelamin, dll.) -->
            <div>
                <h4 class="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3">Spesifikasi Lengkap Ternak</h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="p-3 bg-[#fbfbf9] border border-stone-200 rounded-xl">
                        <span class="text-xs text-stone-500 block">Bobot Hidup</span>
                        <strong id="modalWeight" class="text-base font-bold text-stone-900 mt-0.5 block">780 kg</strong>
                    </div>
                    <div class="p-3 bg-[#fbfbf9] border border-stone-200 rounded-xl">
                        <span class="text-xs text-stone-500 block">Perkiraan Umur</span>
                        <strong id="modalAge" class="text-base font-bold text-stone-900 mt-0.5 block">28 Bulan</strong>
                    </div>
                    <div class="p-3 bg-[#fbfbf9] border border-stone-200 rounded-xl">
                        <span class="text-xs text-stone-500 block">Jenis Kelamin</span>
                        <strong id="modalGender" class="text-base font-bold text-stone-900 mt-0.5 block">Jantan</strong>
                    </div>
                    <div class="p-3 bg-[#fbfbf9] border border-stone-200 rounded-xl">
                        <span class="text-xs text-stone-500 block">Stok Tersedia</span>
                        <strong id="modalStock" class="text-base font-bold text-stone-900 mt-0.5 block">1 Ekor</strong>
                    </div>
                </div>
            </div>

            <!-- Deskripsi & Catatan Dokter Hewan -->
            <div>
                <h4 class="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-2">Kondisi Fisik & Riwayat Pakan</h4>
                <p id="modalDescription" class="text-sm text-stone-700 leading-relaxed bg-[#fbfbf9] p-4 rounded-xl border border-stone-200">
                </p>
            </div>

            <!-- Informasi Profil Peternak / Kandang -->
            <div class="p-4 rounded-xl bg-[#d8f3dc]/40 border border-[#74c69d]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-lg">
                        <span id="modalSellerInitial">K</span>
                    </div>
                    <div>
                        <h5 id="modalSellerName" class="font-bold text-stone-900 text-sm">H. Sukirman</h5>
                        <p id="modalSellerAddress" class="text-xs text-stone-600 mt-0.5">Kandang Ampel, Kaki Gunung Merbabu, Boyolali</p>
                    </div>
                </div>
                <div class="text-xs text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs">
                    Peternak Terverifikasi Resmi
                </div>
            </div>

        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-stone-100 bg-[#fbfbf9] flex flex-col sm:flex-row items-center justify-end gap-3">
            <button type="button" onclick="closeDetailModal()" class="w-full sm:w-auto px-4 py-2.5 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors">
                Tutup
            </button>
            <a id="modalWhatsAppBtn" href="#" target="_blank" rel="noopener noreferrer" 
               class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                <span>Chat Peternak (WA)</span>
            </a>
            <button id="modalOrderBtn" type="button" onclick="proceedToOrderFromDetail()" 
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c2410c] hover:bg-[#9a3412] text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span>Beli / Pesan Hewan Ini</span>
            </button>
        </div>

    </div>
</div>
