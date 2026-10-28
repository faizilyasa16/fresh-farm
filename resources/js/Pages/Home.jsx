import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Reveal from '../Components/Reveal';

export default function Home({ featuredLivestocks = [], categories = [], cities = [], stats = {} }) {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <AppLayout currentRoute="home">
            <Head title="Marketplace Hewan Ternak Terpercaya Sapi, Kambing, Domba, Kerbau" />

            {/* HERO SECTION - Edge-to-Edge Full Width */}
            <section className="w-full bg-[#F4F2EC] border-b border-[#E7E5DF] py-10 lg:py-16">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Left Hero Content */}
                        <div className="lg:col-span-6 xl:col-span-6 anim-slide-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D8F3DC] text-[#1B4332] text-xs font-semibold uppercase tracking-wider mb-5 border border-[#52B788]/30">
                                <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span>
                                <span>Platform Ternak Lokal Terverifikasi</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1917] leading-[1.15] mb-5">
                                Pasar Hewan Ternak Terpercaya Langsung dari <span className="text-[#1B4332] underline decoration-[#52B788]/60">Peternak Lokal</span>
                            </h1>

                            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed mb-8 max-w-2xl font-normal">
                                Solusi aman dan transparan memilih sapi potong, kambing, domba qurban, dan kerbau. Setiap hewan telah melewati inspeksi dokter hewan, timbangan digital riil, dan bergaransi sampai ke lokasi Anda.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                                <Link
                                    href="/katalog"
                                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-base font-semibold shadow-md hover:shadow-lg transition transform active:scale-95"
                                >
                                    <span>Jelajahi Katalog Ternak</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>

                                <a
                                    href="https://wa.me/6281234567890?text=Halo%20Fresh%20Farm,%20saya%20ingin%20konsultasi%20pemilihan%20hewan%20kurban/ternak"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#FBFBF9] text-[#1C1917] border border-[#E7E5DF] text-base font-medium shadow-xs hover:border-[#1B4332]/40 transition"
                                >
                                    <svg className="w-5 h-5 text-[#2D6A4F] fill-current" viewBox="0 0 24 24">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.088.072.191.014.307-.058.115-.087.187-.173.289l-.26.305c-.087.101-.177.21-.077.382.101.172.447.737.96 1.194.662.589 1.22.771 1.393.858.173.087.274.072.376-.044.101-.116.433-.505.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.203.043.072.043.419-.101.824z"/>
                                    </svg>
                                    <span>Konsultasi WhatsApp</span>
                                </a>
                            </div>

                            {/* Trust Stats Bar */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E7E5DF]">
                                <div>
                                    <div className="text-2xl font-bold text-[#1B4332]">100%</div>
                                    <div className="text-xs text-[#57534E] font-medium">Bebas PMK & Vaksin</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#1B4332]">
                                        {stats.total_livestock || '150+'}
                                    </div>
                                    <div className="text-xs text-[#57534E] font-medium">Hewan Siap Kirim</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#1B4332]">
                                        {stats.total_cities || '3'}+ Kota
                                    </div>
                                    <div className="text-xs text-[#57534E] font-medium">Sentra Kandang Lokal</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Showcase Image (Clean, Professional Dummy Image without 3D animation) */}
                        <div className="lg:col-span-6 xl:col-span-6 w-full anim-slide-right">
                            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E7E5DF] shadow-xl group">
                                {/* Main Dummy Hero Image */}
                                <div className="relative aspect-16/11 sm:aspect-16/10 overflow-hidden bg-[#E7E5DF]">
                                    <img
                                        src="/images/sapi-limousin.jpg"
                                        alt="Sapi Limousin Pejantan Boyolali"
                                        className="w-full h-full object-cover group-hover:scale-102 transition duration-700 ease-out"
                                    />
                                    {/* Top Status Tag */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-[#1B4332] text-xs font-semibold shadow-xs border border-white/60">
                                            <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span>
                                            <span>Dokumentasi Fisik Riil Kandang</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Info Card Overlay (Matching User Reference Image 1) */}
                                <div className="p-5 sm:p-6 bg-white border-t border-[#E7E5DF]/70">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C2410C]">
                                                KUALITAS SUPER GRADE A
                                            </span>
                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#D8F3DC] text-[#1B4332]">
                                                PMK Sehat
                                            </span>
                                        </div>
                                        <span className="text-xs text-[#57534E] font-medium">
                                            Kandang: Boyolali, Jawa Tengah
                                        </span>
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] mb-2">
                                        Sapi Limousin Pejantan Boyolali
                                    </h2>
                                    <div className="flex items-center justify-between text-xs text-[#57534E] pt-2 border-t border-[#E7E5DF]/60">
                                        <div>
                                            <span>Bobot Riil: </span>
                                            <strong className="text-[#1C1917] font-bold">620 kg</strong>
                                        </div>
                                        <div>
                                            <span>Umur: </span>
                                            <strong className="text-[#1C1917] font-bold">28 Bln</strong>
                                        </div>
                                        <div>
                                            <span>Vaksinasi: </span>
                                            <strong className="text-[#2D6A4F] font-bold">Lengkap SKKH</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES SECTION - Full Width Edge-to-Edge */}
            <section className="w-full py-12 bg-white border-b border-[#E7E5DF]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                                Pilihan Jenis Hewan
                            </span>
                            <h2 className="text-2xl font-bold text-[#1C1917] tracking-tight mt-1">
                                Kategori Ternak Unggulan
                            </h2>
                        </div>
                        <Link
                            href="/katalog"
                            className="text-sm font-semibold text-[#1B4332] hover:underline flex items-center gap-1 mt-2 md:mt-0"
                        >
                            <span>Buka Semua di Katalog</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {categories.map((cat, index) => {
                            const iconMap = {
                                sapi: 'ðŸ‚',
                                kambing: 'ðŸ',
                                domba: 'ðŸ‘',
                                kerbau: 'ðŸƒ',
                            };
                            return (
                                <Reveal key={cat.id} delay={index * 70} className="h-full">
                                <Link
                                    href={`/katalog?category=${cat.slug}`}
                                    className="h-full p-5 rounded-2xl bg-[#FBFBF9] hover:bg-[#F4F2EC] border border-[#E7E5DF] hover:border-[#2D6A4F]/40 transition group flex flex-col justify-between"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl">{iconMap[cat.slug] || 'ðŸ¾'}</span>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332]">
                                            {cat.livestocks_count || 0} Tersedia
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#1C1917] group-hover:text-[#1B4332] transition">
                                            {cat.name}
                                        </h3>
                                        <p className="text-xs text-[#57534E] line-clamp-1 mt-1">
                                            {cat.description || 'Pilihan ternak sehat dan berkualitas'}
                                        </p>
                                    </div>
                                </Link>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FEATURED LIVESTOCK SHOWCASE - Full Width Edge-to-Edge */}
            <section className="w-full py-16 bg-[#FBFBF9] border-b border-[#E7E5DF]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                                Pilihan Rekomendasi
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight mt-1">
                                Hewan Ternak Siap Kirim Hari Ini
                            </h2>
                            <p className="text-sm text-[#57534E] mt-1">
                                Seluruh ternak sudah melewati verifikasi bobot timbangan hidup dan sertifikasi bebas PMK.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link
                                href="/katalog"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#E7E5DF] hover:border-[#1B4332] text-sm font-semibold text-[#1B4332] transition"
                            >
                                <span>Lihat Semua ({stats.total_livestock || featuredLivestocks.length} Ternak)</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Cards Grid - Full Width Edge-to-Edge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featuredLivestocks.map((livestock, index) => {
                            const primaryImage = livestock.images?.[0]?.image_url || '/images/hero-farm.jpg';
                            return (
                                <Reveal key={livestock.id} delay={(index % 4) * 80} className="h-full">
                                <div
                                    className="relative h-full bg-white rounded-2xl overflow-hidden border border-[#E7E5DF] hover:border-[#2D6A4F]/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group focus-within:ring-2 focus-within:ring-[#1B4332]"
                                >
                                    {/* Image Container with Badges */}
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

                                    {/* Card Content */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between text-xs text-[#57534E] mb-1.5">
                                                <span className="font-medium text-[#C2410C]">
                                                    Ras: {livestock.breed}
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

                                            {/* Key Specs */}
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

                                        {/* Bottom Action & Price */}
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
                </div>
            </section>

            {/* 4 PILAR JAMINAN FRESH FARM - Full Width Edge-to-Edge */}
            <section className="w-full py-16 bg-white border-b border-[#E7E5DF]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                            Standar Transaksi & Kesehatan
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight mt-1">
                            Kenapa Memilih Fresh Farm?
                        </h2>
                        <p className="text-sm text-[#57534E] mt-2">
                            Kami menstandarisasi tata cara pembelian hewan ternak agar pembeli tenang dan peternak lokal berdaya.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#E7E5DF]">
                            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center text-2xl mb-4 font-bold">
                                ðŸ©º
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Bebas PMK & Sertifikasi Medis
                            </h3>
                            <p className="text-xs text-[#57534E] leading-relaxed">
                                Setiap ternak wajib memiliki surat keterangan kesehatan hewan (SKKH) dari dinas peternakan dan vaksinasi PMK tervalidasi.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#E7E5DF]">
                            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center text-2xl mb-4 font-bold">
                                âš–ï¸
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Timbangan Digital Transparan
                            </h3>
                            <p className="text-xs text-[#57534E] leading-relaxed">
                                Tidak ada taksiran sepihak. Bobot ditimbang secara digital dan dapat diverifikasi ulang saat serah terima di kandang.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#E7E5DF]">
                            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center text-2xl mb-4 font-bold">
                                ðŸšš
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Armada Angkut Khusus Ternak
                            </h3>
                            <p className="text-xs text-[#57534E] leading-relaxed">
                                Pengiriman dengan bak berventilasi, alas jerami, pakan rumput selama perjalanan, dan pendamping profesional.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#E7E5DF]">
                            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center text-2xl mb-4 font-bold">
                                ðŸ›¡ï¸
                            </div>
                            <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                Pembayaran Aman & Rekber
                            </h3>
                            <p className="text-xs text-[#57534E] leading-relaxed">
                                Dana pembayaran dijamin aman dan hanya diteruskan ke peternak setelah hewan sampai di lokasi pembeli dalam kondisi prima.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
