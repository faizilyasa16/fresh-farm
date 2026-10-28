<!-- Modal Checkout / Pemesanan Ternak (PRD 4.A.4) -->
<div id="orderModal" class="fixed inset-0 z-50 hidden overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all my-8 max-h-[90vh] flex flex-col">
        
        <!-- Header Modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#fbfbf9]">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-[#c2410c] text-white flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <div>
                    <h3 class="text-base font-bold text-stone-900">Form Pemesanan Hewan Ternak</h3>
                    <p class="text-xs text-stone-500">Booking aman langsung ke peternak terverifikasi</p>
                </div>
            </div>
            <button type="button" onclick="closeOrderModal()" class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Form Pemesanan -->
        <form action="{{ route('orders.store') }}" method="POST" id="orderForm" class="p-6 overflow-y-auto space-y-5">
            @csrf
            <input type="hidden" name="livestock_id" id="orderLivestockId" value="">
            <input type="hidden" id="orderAnimalCategory" value="sapi">
            <input type="hidden" id="orderBasePrice" value="0">

            <!-- Ringkasan Hewan Terpilih -->
            <div class="p-4 rounded-xl bg-[#fbfbf9] border border-stone-200 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <img id="orderAnimalImage" src="" alt="" class="w-16 h-16 rounded-lg object-cover border border-stone-200">
                    <div>
                        <h4 id="orderAnimalTitle" class="text-sm font-bold text-stone-900"></h4>
                        <p class="text-xs text-stone-500 mt-0.5">Bobot: <strong id="orderAnimalWeight" class="text-stone-800"></strong> | Peternak: <strong id="orderAnimalSeller" class="text-stone-800"></strong></p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-xs text-stone-500 block">Harga Hewan</span>
                    <strong id="orderAnimalPriceFormatted" class="text-base font-bold text-[#1b4332]"></strong>
                </div>
            </div>

            <!-- Form Data Pembeli -->
            <div class="space-y-4">
                <div>
                    <label for="buyer_name" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Nama Lengkap Pembeli / Panitia *</label>
                    <input type="text" name="buyer_name" id="buyer_name" required 
                           placeholder="Contoh: H. Ahmad Fauzi (Panitia Kurban)"
                           class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors">
                </div>

                <div>
                    <label for="buyer_phone" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Nomor WhatsApp Aktif *</label>
                    <input type="tel" name="buyer_phone" id="buyer_phone" required 
                           placeholder="Contoh: 081234567890"
                           class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors">
                    <p class="text-[11px] text-stone-500 mt-1">Peternak akan menghubungi via WhatsApp untuk konfirmasi detail dan koordinasi pengiriman.</p>
                </div>

                <div>
                    <label for="shipping_address" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Alamat Lengkap Pengiriman / Domisili *</label>
                    <textarea name="shipping_address" id="shipping_address" rows="2" required 
                              placeholder="Alamat jalan, kelurahan, kecamatan, kota, patokan lokasi..."
                              class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors"></textarea>
                </div>

                <!-- Metode Pengiriman (PRD 4.A.4) -->
                <div>
                    <label class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">Metode Penyerahan Hewan *</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label class="relative flex flex-col p-3 rounded-xl border border-stone-300 cursor-pointer hover:border-[#2d6a4f] transition-all has-[:checked]:border-[#2d6a4f] has-[:checked]:bg-[#d8f3dc]/20">
                            <input type="radio" name="delivery_method" value="pickup" checked onchange="updateOrderTotals()" class="sr-only">
                            <span class="text-xs font-bold text-stone-900">Ambil Mandiri di Kandang</span>
                            <span class="text-[11px] text-stone-500 mt-0.5">Survei langsung & angkut sendiri</span>
                            <span class="text-xs font-bold text-emerald-700 mt-2">Gratis (Rp 0)</span>
                        </label>
                        <label class="relative flex flex-col p-3 rounded-xl border border-stone-300 cursor-pointer hover:border-[#2d6a4f] transition-all has-[:checked]:border-[#2d6a4f] has-[:checked]:bg-[#d8f3dc]/20">
                            <input type="radio" name="delivery_method" value="courier" onchange="updateOrderTotals()" class="sr-only">
                            <span class="text-xs font-bold text-stone-900">Diantar Armada Ternak</span>
                            <span class="text-[11px] text-stone-500 mt-0.5">Mobil bak khusus ternak & pakan</span>
                            <span id="orderCourierPriceText" class="text-xs font-bold text-[#c2410c] mt-2">+Rp 650.000</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label for="notes" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Catatan Tambahan (Opsional)</label>
                    <input type="text" name="notes" id="notes" 
                           placeholder="Contoh: Titip rawat sampai H-1 Idul Adha, mohon tanduk jangan lecet"
                           class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors">
                </div>
            </div>

            <!-- Ringkasan Biaya -->
            <div class="border-t border-stone-200 pt-4 space-y-2 text-sm">
                <div class="flex justify-between text-stone-600">
                    <span>Harga Hewan:</span>
                    <span id="orderSummaryBasePrice">Rp 0</span>
                </div>
                <div class="flex justify-between text-stone-600">
                    <span>Biaya Pengiriman:</span>
                    <span id="orderSummaryShippingPrice">Rp 0</span>
                </div>
                <div class="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-2">
                    <span>Total Tagihan:</span>
                    <span id="orderSummaryTotalPrice" class="text-[#c2410c] text-lg">Rp 0</span>
                </div>
            </div>

            <!-- Footer Actions -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button type="button" onclick="closeOrderModal()" class="w-full sm:w-auto px-4 py-2.5 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors">
                    Batal
                </button>
                <button type="submit" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#c2410c] hover:bg-[#9a3412] text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                    <span>Konfirmasi Booking & Lanjut ke WhatsApp</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
        </form>

    </div>
</div>
