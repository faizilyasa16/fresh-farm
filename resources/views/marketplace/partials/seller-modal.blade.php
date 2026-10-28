<!-- Modal Manajemen Data Hewan Ternak (Seller / Admin CRUD - PRD 4.B) -->
<div id="sellerModal" class="fixed inset-0 z-50 hidden overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all my-8 max-h-[92vh] flex flex-col">
        
        <!-- Header Modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#fbfbf9]">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-stone-900">Portal Peternak: Manajemen Hewan Ternak (CRUD)</h3>
                    <p class="text-xs text-stone-500">Kelola inventaris kandang, tambah hewan baru, update bobot & harga, atau arsipkan listing</p>
                </div>
            </div>
            <button type="button" onclick="closeSellerModal()" class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-stone-200 bg-stone-50/70 px-6 pt-2">
            <button type="button" id="tabBtnCreate" onclick="switchSellerTab('create')" 
                    class="px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-[#1b4332] text-[#1b4332] transition-colors">
                + Tambah Data Hewan Baru
            </button>
            <button type="button" id="tabBtnList" onclick="switchSellerTab('list')" 
                    class="px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition-colors">
                Daftar Inventaris Kandang ({{ $livestocks->total() }} Ekor)
            </button>
        </div>

        <!-- Body Scrollable -->
        <div class="p-6 overflow-y-auto">
            
            <!-- Tab 1: Form Create (Tambah Data Hewan) -->
            <div id="sellerTabCreate">
                <form action="{{ route('seller.livestock.store') }}" method="POST" class="space-y-5">
                    @csrf
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label for="seller_title" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Judul Iklan Listing *</label>
                            <input type="text" name="title" id="seller_title" required 
                                   placeholder="Contoh: Sapi Limousin Super Bobot 780kg Siap Kurban"
                                   class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                        </div>

                        <div>
                            <label for="seller_category_id" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Kategori Hewan *</label>
                            <select name="category_id" id="seller_category_id" required 
                                    class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                                @foreach($categories as $cat)
                                    <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label for="seller_breed" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Jenis Ras Hewan *</label>
                            <input type="text" name="breed" id="seller_breed" required 
                                   placeholder="Contoh: Limousin, Simental, Etawa, Garut, Murrah"
                                   class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                        </div>

                        <div>
                            <label for="seller_gender" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Jenis Kelamin *</label>
                            <select name="gender" id="seller_gender" required 
                                    class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                                <option value="male">Jantan (Direkomendasikan Kurban/Aqiqah)</option>
                                <option value="female">Betina</option>
                            </select>
                        </div>

                        <div>
                            <label for="seller_weight" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Bobot Hewan (kg) *</label>
                            <input type="number" step="0.5" name="weight_kg" id="seller_weight" required 
                                   placeholder="Contoh: 650"
                                   class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                        </div>

                        <div>
                            <label for="seller_age" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Perkiraan Umur (Bulan) *</label>
                            <input type="number" name="age_months" id="seller_age" required 
                                   placeholder="Contoh: 24 (2 tahun)"
                                   class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                        </div>

                        <div>
                            <label for="seller_price" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Harga Jual (Rp) *</label>
                            <input type="number" step="50000" name="price" id="seller_price" required 
                                   placeholder="Contoh: 35000000"
                                   class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                        </div>

                        <div>
                            <label for="seller_stock" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Jumlah Ekor Tersedia *</label>
                            <input type="number" name="stock" id="seller_stock" value="1" min="1" required 
                                   class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                        </div>

                        <div>
                            <label for="seller_peternak_id" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Pilih Kandang Peternak *</label>
                            <select name="seller_id" id="seller_peternak_id" required 
                                    class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                                @foreach($sellers as $s)
                                    <option value="{{ $s->id }}">{{ $s->name }} ({{ $s->city }})</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="md:col-span-2">
                            <label for="seller_health" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Status Kesehatan & Vaksinasi *</label>
                            <input type="text" name="health_status" id="seller_health" required 
                                   value="Sudah Vaksin PMK 2x & Bersertifikat Dinas Peternakan"
                                   placeholder="Contoh: Sudah Vaksin PMK & SKKH Aktif"
                                   class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]">
                        </div>

                        <div class="md:col-span-2">
                            <label for="seller_desc" class="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Deskripsi Kondisi Ternak & Pakan</label>
                            <textarea name="description" id="seller_desc" rows="3" 
                                      placeholder="Jelaskan kondisi fisik, nafsu makan, jenis pakan harian, riwayat perawatan di kandang..."
                                      class="w-full text-sm rounded-lg border border-stone-300 px-3.5 py-2.5 focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]"></textarea>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                        <button type="button" onclick="closeSellerModal()" class="px-4 py-2.5 text-stone-600 text-sm font-medium">Batal</button>
                        <button type="submit" class="px-6 py-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                            Simpan & Tayangkan ke Marketplace
                        </button>
                    </div>
                </form>
            </div>

            <!-- Tab 2: List Inventaris Kandang (Read, Update, Soft Delete) -->
            <div id="sellerTabList" class="hidden">
                <div class="overflow-x-auto rounded-xl border border-stone-200">
                    <table class="w-full text-left text-xs sm:text-sm">
                        <thead class="bg-stone-50 text-stone-700 uppercase text-[11px] font-semibold border-b border-stone-200">
                            <tr>
                                <th class="py-3 px-4">Ternak</th>
                                <th class="py-3 px-4">Kategori / Ras</th>
                                <th class="py-3 px-4">Bobot & Umur</th>
                                <th class="py-3 px-4">Harga</th>
                                <th class="py-3 px-4">Status</th>
                                <th class="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-200 text-stone-700">
                            @forelse($livestocks as $item)
                                <tr class="hover:bg-stone-50/70 transition-colors">
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-3">
                                            <img src="{{ $item->primary_image_url }}" alt="" class="w-10 h-10 rounded-lg object-cover border border-stone-200">
                                            <div>
                                                <strong class="font-semibold text-stone-900 block leading-tight">{{ $item->title }}</strong>
                                                <span class="text-[11px] text-stone-500">{{ $item->seller->name ?? 'Peternak' }} ({{ $item->seller->city ?? '' }})</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="font-medium text-stone-800">{{ $item->category->name }}</span>
                                        <span class="block text-stone-500 text-[11px]">{{ $item->breed }}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="font-bold text-stone-900">{{ $item->weight_kg }} kg</span>
                                        <span class="block text-stone-500 text-[11px]">{{ $item->age_months }} Bulan</span>
                                    </td>
                                    <td class="py-3 px-4 font-bold text-[#c2410c]">
                                        {{ $item->formatted_price }}
                                    </td>
                                    <td class="py-3 px-4">
                                        <!-- Quick Status Form (PRD 4.B Update Status) -->
                                        <form action="{{ route('seller.livestock.update', $item->id) }}" method="POST" class="inline-block">
                                            @csrf
                                            @method('PUT')
                                            <select name="status" onchange="this.form.submit()" 
                                                    class="text-xs font-semibold py-1 px-2 rounded-md border border-stone-300 {{ $item->status === 'available' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : ($item->status === 'booked' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-stone-100 text-stone-600') }}">
                                                <option value="available" {{ $item->status === 'available' ? 'selected' : '' }}>Tersedia</option>
                                                <option value="booked" {{ $item->status === 'booked' ? 'selected' : '' }}>Dipesan</option>
                                                <option value="sold" {{ $item->status === 'sold' ? 'selected' : '' }}>Terjual</option>
                                            </select>
                                        </form>
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <!-- Delete / Soft Delete Button (PRD 4.B Delete) -->
                                        <form action="{{ route('seller.livestock.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin mengarsipkan ternak ini dari katalog utama?');" class="inline-block">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Listing (Soft Delete)">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                <span class="sr-only">Hapus</span>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="py-8 text-center text-stone-500 text-xs">
                                        Belum ada data ternak di inventaris kandang.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    </div>
</div>
