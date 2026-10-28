import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const COMPANY_NAME = 'Fresh Farm';

const aboutLinks = [
    { key: 'about-kami', label: 'Tentang Kami', href: '/tentang/kami' },
    { key: 'about-hubungi', label: 'Hubungi Kami', href: '/tentang/hubungi' },
    { key: 'about-lokasi', label: 'Lokasi', href: '/tentang/lokasi' },
    { key: 'about-pengiriman', label: 'Pengiriman', href: '/tentang/pengiriman' },
    { key: 'about-garansi', label: 'Tentang Garansi', href: '/tentang/garansi' },
];

const navLinkClass = (isActive) =>
    `text-sm transition border-b-2 pb-1 ${
        isActive
            ? 'text-[#1B4332] font-semibold border-[#1B4332]'
            : 'text-[#57534E] font-medium border-transparent hover:text-[#1B4332]'
    }`;

export default function AppLayout({ children, currentRoute = '' }) {
    const { flash } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dismissFlash, setDismissFlash] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(currentRoute.startsWith('about'));

    const isAboutActive = currentRoute.startsWith('about');

    return (
        <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1C1917] selection:bg-[#2D6A4F] selection:text-white">
            {/* Top Announcement Bar */}
            <div className="w-full bg-[#1B4332] text-[#D8F3DC] text-xs sm:text-sm py-2 px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between border-b border-[#2D6A4F]/40">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#52B788]"></span>
                    <span className="font-medium">Jaminan Hewan Bebas PMK &amp; Bergaransi Sampai Kandang</span>
                    <span className="hidden md:inline text-white/50">|</span>
                    <span className="hidden md:inline text-white/80">Siap Kirim Boyolali, Bogor, Garut, Jabodetabek &amp; Seluruh Jawa</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.088.072.191.014.307-.058.115-.087.187-.173.289l-.26.305c-.087.101-.177.21-.077.382.101.172.447.737.96 1.194.662.589 1.22.771 1.393.858.173.087.274.072.376-.044.101-.116.433-.505.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.203.043.072.043.419-.101.824z" />
                        </svg>
                        <span>Hotline: 0812-3456-7890</span>
                    </a>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-[#E7E5DF]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-3.5 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold group-hover:bg-[#2D6A4F] transition">
                            <span className="text-xl">🌿</span>
                        </div>
                        <div>
                            <div className="text-xl font-bold tracking-tight text-[#1B4332]">{COMPANY_NAME}</div>
                            <p className="text-[11px] text-[#57534E] font-medium leading-none">Pasar Hewan Ternak Terpercaya</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-7" aria-label="Navigasi utama">
                        <Link
                            href="/"
                            aria-current={currentRoute === 'home' ? 'page' : undefined}
                            className={navLinkClass(currentRoute === 'home')}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/katalog"
                            aria-current={currentRoute === 'catalog' ? 'page' : undefined}
                            className={navLinkClass(currentRoute === 'catalog')}
                        >
                            Katalog Hewan
                        </Link>

                        {/* About dropdown */}
                        <div
                            className="relative"
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setAboutDropdownOpen(false);
                                }
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                                className={`flex items-center gap-1.5 ${navLinkClass(isAboutActive)}`}
                                aria-expanded={aboutDropdownOpen}
                                aria-haspopup="true"
                            >
                                <span>Tentang {COMPANY_NAME}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {aboutDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setAboutDropdownOpen(false)} />
                                    <div className="anim-fade-down absolute left-0 mt-2.5 w-56 rounded-xl bg-white shadow-lg border border-[#E7E5DF] py-2 z-50">
                                        {aboutLinks.map((item) => (
                                            <Link
                                                key={item.key}
                                                href={item.href}
                                                aria-current={currentRoute === item.key ? 'page' : undefined}
                                                className={`block px-4 py-2.5 text-sm transition ${
                                                    currentRoute === item.key
                                                        ? 'bg-[#D8F3DC]/60 text-[#1B4332] font-semibold'
                                                        : 'text-[#1C1917] hover:bg-[#F4F2EC] hover:text-[#1B4332]'
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Right CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/katalog"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-semibold transition"
                        >
                            Pilih Hewan Kurban
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2.5 rounded-lg text-[#57534E] hover:bg-[#F4F2EC]"
                        aria-label="Menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="anim-fade-down md:hidden border-t border-[#E7E5DF] bg-white px-4 py-4 space-y-2">
                        <Link
                            href="/"
                            aria-current={currentRoute === 'home' ? 'page' : undefined}
                            className={`block px-3 py-3 rounded-lg text-sm ${
                                currentRoute === 'home'
                                    ? 'bg-[#D8F3DC]/60 text-[#1B4332] font-semibold'
                                    : 'text-[#1C1917] font-medium hover:bg-[#F4F2EC]'
                            }`}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/katalog"
                            aria-current={currentRoute === 'catalog' ? 'page' : undefined}
                            className={`block px-3 py-3 rounded-lg text-sm ${
                                currentRoute === 'catalog'
                                    ? 'bg-[#D8F3DC]/60 text-[#1B4332] font-semibold'
                                    : 'text-[#1C1917] font-medium hover:bg-[#F4F2EC]'
                            }`}
                        >
                            Katalog Hewan
                        </Link>

                        <div className="rounded-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                                aria-expanded={mobileAboutOpen}
                                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm ${
                                    isAboutActive
                                        ? 'text-[#1B4332] font-semibold'
                                        : 'text-[#1C1917] font-medium hover:bg-[#F4F2EC]'
                                }`}
                            >
                                <span>Tentang {COMPANY_NAME}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {mobileAboutOpen && (
                                <div className="pl-3 border-l-2 border-[#E7E5DF] ml-3 mt-1 space-y-1">
                                    {aboutLinks.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            aria-current={currentRoute === item.key ? 'page' : undefined}
                                            className={`block px-3 py-2.5 rounded-lg text-sm ${
                                                currentRoute === item.key
                                                    ? 'bg-[#D8F3DC]/60 text-[#1B4332] font-semibold'
                                                    : 'text-[#57534E] hover:bg-[#F4F2EC]'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/katalog"
                                className="w-full text-center block px-4 py-3 rounded-lg bg-[#C2410C] text-white text-sm font-semibold"
                            >
                                Pilih Hewan Kurban &amp; Aqiqah
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Notifications */}
            {!dismissFlash && flash?.success && (
                <div className="w-full bg-[#D8F3DC] text-[#1B4332] border-b border-[#52B788]/40 px-4 sm:px-8 lg:px-12 xl:px-16 py-3 flex items-center justify-between text-sm font-medium">
                    <span>{flash.success}</span>
                    <button onClick={() => setDismissFlash(true)} className="text-[#2D6A4F] hover:text-[#1B4332] font-bold text-lg leading-none" aria-label="Tutup">
                        &times;
                    </button>
                </div>
            )}

            {!dismissFlash && flash?.error && (
                <div className="w-full bg-[#FEE2E2] text-[#991B1B] border-b border-[#F87171]/40 px-4 sm:px-8 lg:px-12 xl:px-16 py-3 flex items-center justify-between text-sm font-medium">
                    <span>{flash.error}</span>
                    <button onClick={() => setDismissFlash(true)} className="text-[#991B1B] hover:text-black font-bold text-lg leading-none" aria-label="Tutup">
                        &times;
                    </button>
                </div>
            )}

            {/* Order Confirmation (shown after successful booking) */}
            {flash?.order_success && !dismissFlash && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
                    <div className="anim-fade-up bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7E5DF]">
                        <div className="w-12 h-12 rounded-full bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mx-auto mb-4 text-2xl">
                            ✓
                        </div>
                        <h3 className="text-xl font-bold text-center text-[#1C1917] mb-2">Booking Ternak Berhasil Diterima</h3>
                        <p className="text-sm text-[#57534E] text-center mb-6">
                            Nomor Pesanan: <strong className="text-[#1C1917]">#{flash.order_success.order_id}</strong> untuk ternak <strong className="text-[#1C1917]">{flash.order_success.livestock_title}</strong>. Status ternak telah di-reserve untuk Anda.
                        </p>

                        <div className="bg-[#F4F2EC] rounded-xl p-4 mb-6 text-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#57534E]">Total Pembayaran:</span>
                                <span className="font-bold text-[#1B4332] text-base">
                                    Rp {new Intl.NumberFormat('id-ID').format(flash.order_success.total_amount)}
                                </span>
                            </div>
                            <p className="text-xs text-[#57534E]">
                                Klik tombol di bawah untuk menghubungi peternak via WhatsApp guna konfirmasi foto, jadwal pengiriman, dan instruksi pembayaran.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={flash.order_success.whatsapp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold text-sm transition"
                            >
                                Konfirmasi ke WhatsApp Peternak
                            </a>
                            <button
                                type="button"
                                onClick={() => setDismissFlash(true)}
                                className="w-full py-2.5 text-center text-sm font-medium text-[#57534E] hover:text-[#1C1917]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full">{children}</main>

            {/* Footer */}
            <footer className="w-full bg-[#1B4332] text-white border-t border-[#2D6A4F]/60 mt-16">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 lg:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🌿</span>
                                <span className="text-xl font-bold tracking-tight">{COMPANY_NAME}</span>
                            </div>
                            <p className="text-sm text-[#D8F3DC]/80 leading-relaxed mb-4">
                                Platform marketplace hewan ternak yang menghubungkan peternak lokal langsung dengan konsumen. Transparan dalam bobot, umur, kesehatan PMK, dan harga.
                            </p>
                            <div className="text-xs text-[#D8F3DC]/60 space-y-1">
                                <p>Boyolali, Jawa Tengah</p>
                                <p>Bogor, Jawa Barat</p>
                                <p>Garut, Jawa Barat</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D8F3DC] mb-4">Kategori Ternak</h4>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li><Link href="/katalog?category=sapi" className="hover:text-white transition">Sapi Potong &amp; Kurban</Link></li>
                                <li><Link href="/katalog?category=kambing" className="hover:text-white transition">Kambing Peranakan</Link></li>
                                <li><Link href="/katalog?category=domba" className="hover:text-white transition">Domba Pedaging &amp; Aqiqah</Link></li>
                                <li><Link href="/katalog?category=kerbau" className="hover:text-white transition">Kerbau Murrah &amp; Lumpur</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D8F3DC] mb-4">Tentang {COMPANY_NAME}</h4>
                            <ul className="space-y-2 text-sm text-white/80">
                                {aboutLinks.map((item) => (
                                    <li key={item.key}>
                                        <Link href={item.href} className="hover:text-white transition">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D8F3DC] mb-4">Bantuan</h4>
                            <p className="text-sm text-white/80 mb-3">
                                Ada pertanyaan seputar pemilihan hewan, pengiriman, atau pembayaran? Tim kami siap membantu.
                            </p>
                            <a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 rounded-lg bg-[#2D6A4F] hover:bg-[#40916C] text-white text-xs font-semibold transition"
                            >
                                Hubungi via WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#2D6A4F]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8F3DC]/70 gap-4">
                        <p>© 2026 {COMPANY_NAME}. Seluruh hak cipta dilindungi undang-undang.</p>
                        <p>Pasar Hewan Ternak Beretika &amp; Transparan</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
