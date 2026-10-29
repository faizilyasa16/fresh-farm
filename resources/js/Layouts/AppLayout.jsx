import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const COMPANY_NAME = 'Fresh Farm';

const aboutLinks = [
    { key: 'about-kami', label: 'Tentang Kami', href: '/tentang/kami' },
    { key: 'about-hubungi', label: 'Hubungi Kami', href: '/tentang/hubungi' },
    { key: 'about-lokasi', label: 'Lokasi', href: '/tentang/lokasi' },
    { key: 'about-pengiriman', label: 'Pengiriman', href: '/tentang/pengiriman' },
    { key: 'about-garansi', label: 'Tentang Garansi', href: '/tentang/garansi' },
];

const roleLabelMap = {
    admin: 'Admin',
    seller: 'Peternak',
    buyer: 'Pembeli',
};

const navLinkClass = (isActive) =>
    `min-h-11 inline-flex items-center text-sm transition-colors border-b-2 px-1 ${
        isActive
            ? 'text-[#1B4332] font-semibold border-[#1B4332]'
            : 'text-[#57534E] font-medium border-transparent hover:text-[#1B4332]'
    }`;

const mobileNavClass = (isActive) =>
    `min-h-11 flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
        isActive
            ? 'bg-[#D8F3DC] text-[#1B4332] font-semibold'
            : 'text-[#1C1917] font-medium hover:bg-[#F4F2EC]'
    }`;

const footerLinkClass = 'min-h-11 inline-flex items-center text-sm text-white/90 hover:text-white hover:underline underline-offset-2';

export default function AppLayout({ children, currentRoute = '' }) {
    const { auth, flash } = usePage().props;
    const currentUser = auth?.user || null;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dismissedFlashKey, setDismissedFlashKey] = useState('');
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(currentRoute.startsWith('about'));

    const activeFlashKey = `${flash?.success || ''}|${flash?.error || ''}|${flash?.order_success?.order_id || ''}`;
    const isFlashDismissed = dismissedFlashKey === activeFlashKey && activeFlashKey !== '||';
    const isAboutActive = currentRoute.startsWith('about');

    useEffect(() => {
        if (!flash?.order_success || isFlashDismissed) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setDismissedFlashKey(activeFlashKey);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [flash?.order_success, isFlashDismissed, activeFlashKey]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1C1917] selection:bg-[#2D6A4F] selection:text-white">
            <div className="w-full bg-[#1B4332] text-[#D8F3DC] text-xs py-2 px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between border-b border-[#2D6A4F]/50">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Hewan Ternak Bersertifikat SKKH dan Timbangan Digital</span>
                    <span className="hidden lg:inline text-white/50">|</span>
                    <span className="hidden lg:inline text-white/85">Sentra Kandang Boyolali, Bogor, dan Garut</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium shrink-0">
                    <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors underline-offset-2 hover:underline"
                    >
                        WhatsApp: 0812-3456-7890
                    </a>
                </div>
            </div>

            <header className="sticky top-0 z-40 bg-white border-b border-[#D6D3CB]">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5 flex items-center justify-between gap-4">
                    <Link href="/" className="min-h-11 flex items-center gap-3 group shrink-0">
                        <img src="/images/logo.png" alt="Fresh Farm" className="h-10 sm:h-12 w-auto object-contain" />
                        <div>
                            <div className="text-lg sm:text-xl font-bold tracking-tight text-[#1B4332] leading-tight">
                                {COMPANY_NAME}
                            </div>
                            <p className="text-[11px] text-[#57534E] font-medium leading-none mt-0.5">
                                Pasar Hewan Ternak Lokal
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6" aria-label="Navigasi utama">
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
                                className={`gap-1.5 cursor-pointer ${navLinkClass(isAboutActive)}`}
                                aria-expanded={aboutDropdownOpen}
                                aria-haspopup="true"
                            >
                                <span>Tentang {COMPANY_NAME}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-150 ${aboutDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {aboutDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setAboutDropdownOpen(false)} />
                                    <div className="anim-fade-down absolute left-0 mt-1.5 w-56 rounded-xl bg-white shadow-md border border-[#D6D3CB] py-1.5 z-50">
                                        {aboutLinks.map((item) => (
                                            <Link
                                                key={item.key}
                                                href={item.href}
                                                aria-current={currentRoute === item.key ? 'page' : undefined}
                                                className={`min-h-11 flex items-center px-4 py-2 text-sm transition-colors ${
                                                    currentRoute === item.key
                                                        ? 'bg-[#D8F3DC] text-[#1B4332] font-semibold'
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

                    <div className="hidden md:flex items-center gap-2.5 shrink-0">
                        {currentUser ? (
                            <div
                                className="relative"
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setUserDropdownOpen(false);
                                    }
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    aria-expanded={userDropdownOpen}
                                    aria-haspopup="true"
                                    className={`min-h-11 inline-flex items-center gap-2 px-1 text-sm font-medium transition-colors cursor-pointer ${
                                        userDropdownOpen ? 'text-[#1B4332]' : 'text-[#57534E] hover:text-[#1B4332]'
                                    }`}
                                >
                                    <span className="max-w-40 truncate">{currentUser.name}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setUserDropdownOpen(false)}
                                        />
                                        <div className="anim-fade-down absolute right-0 mt-1.5 w-60 rounded-xl bg-white shadow-lg border border-[#D6D3CB] py-1.5 z-50 overflow-hidden divide-y divide-[#E7E5DF]">
                                            <div className="px-4 py-2.5 bg-[#FAF9F5]">
                                                <p className="text-[11px] font-medium text-[#57534E]">Masuk sebagai</p>
                                                <p className="text-sm font-bold text-[#1B4332] truncate">{currentUser.name}</p>
                                                <p className="text-[11px] text-[#57534E] truncate mt-0.5">
                                                    {currentUser.email || roleLabelMap[currentUser.role] || 'Akun'}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    aria-current={currentRoute === 'dashboard' ? 'page' : undefined}
                                                    className={`min-h-11 flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                                                        currentRoute === 'dashboard'
                                                            ? 'bg-[#D8F3DC] text-[#1B4332] font-semibold'
                                                            : 'text-[#1C1917] hover:bg-[#F4F2EC] hover:text-[#1B4332]'
                                                    }`}
                                                >
                                                    <svg className="w-4 h-4 text-[#1B4332] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                    </svg>
                                                    <span>Dashboard</span>
                                                </Link>
                                            </div>

                                            <div className="py-1">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        setUserDropdownOpen(false);
                                                        handleLogout(e);
                                                    }}
                                                    className="w-full min-h-11 flex items-center gap-2.5 px-4 py-2 text-sm text-[#991B1B] hover:bg-[#FEE2E2] hover:text-[#7F1D1D] transition-colors cursor-pointer font-medium text-left"
                                                >
                                                    <svg className="w-4 h-4 text-[#991B1B] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Keluar</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`min-h-11 inline-flex items-center justify-center px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                                        currentRoute === 'login'
                                            ? 'bg-[#F4F2EC] border-[#1B4332] text-[#1B4332]'
                                            : 'bg-white hover:bg-[#F4F2EC] border-[#78716C] text-[#1C1917]'
                                    }`}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="min-h-11 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition-colors"
                                >
                                    Daftar Akun
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden min-h-11 inline-flex items-center gap-2 px-1 text-[#57534E] hover:text-[#1B4332] text-sm font-medium transition-colors cursor-pointer"
                        aria-label="Menu navigasi"
                        aria-expanded={mobileMenuOpen}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                        <span>Menu</span>
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="anim-fade-down md:hidden border-t border-[#D6D3CB] bg-white px-4 py-4 space-y-1">
                        <Link
                            href="/"
                            aria-current={currentRoute === 'home' ? 'page' : undefined}
                            className={mobileNavClass(currentRoute === 'home')}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/katalog"
                            aria-current={currentRoute === 'catalog' ? 'page' : undefined}
                            className={mobileNavClass(currentRoute === 'catalog')}
                        >
                            Katalog Hewan
                        </Link>

                        <div>
                            <button
                                type="button"
                                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                                aria-expanded={mobileAboutOpen}
                                className={`w-full justify-between cursor-pointer ${mobileNavClass(false)} ${
                                    isAboutActive ? 'text-[#1B4332] font-semibold' : ''
                                }`}
                            >
                                <span>Tentang {COMPANY_NAME}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-150 ${mobileAboutOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {mobileAboutOpen && (
                                <div className="pl-3 border-l-2 border-[#D6D3CB] ml-3 mt-1 space-y-1">
                                    {aboutLinks.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            aria-current={currentRoute === item.key ? 'page' : undefined}
                                            className={`min-h-11 flex items-center px-3 py-2 rounded-lg text-sm ${
                                                currentRoute === item.key
                                                    ? 'bg-[#D8F3DC] text-[#1B4332] font-semibold'
                                                    : 'text-[#57534E] hover:bg-[#F4F2EC]'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-2 mt-2 border-t border-[#E7E5DF] space-y-1">
                            {currentUser ? (
                                <>
                                    <div className="px-3 py-1.5">
                                        <p className="text-xs font-semibold text-[#1B4332] truncate">{currentUser.name}</p>
                                        <p className="text-[11px] text-[#57534E] truncate">
                                            {roleLabelMap[currentUser.role] || 'Akun'}
                                            {currentUser.email ? ` · ${currentUser.email}` : ''}
                                        </p>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        aria-current={currentRoute === 'dashboard' ? 'page' : undefined}
                                        className={mobileNavClass(currentRoute === 'dashboard')}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full min-h-11 flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-[#991B1B] hover:bg-[#FEE2E2] transition-colors cursor-pointer text-left"
                                    >
                                        Keluar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        aria-current={currentRoute === 'login' ? 'page' : undefined}
                                        className={mobileNavClass(currentRoute === 'login')}
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        aria-current={currentRoute === 'register' ? 'page' : undefined}
                                        className={mobileNavClass(currentRoute === 'register')}
                                    >
                                        Daftar Akun
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {!isFlashDismissed && flash?.success && (
                <div
                    role="status"
                    className="w-full bg-[#D8F3DC] text-[#1B4332] border-b border-[#2D6A4F]/40 px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5 flex items-center justify-between gap-4 text-sm font-medium"
                >
                    <span>{flash.success}</span>
                    <button
                        type="button"
                        onClick={() => setDismissedFlashKey(activeFlashKey)}
                        className="min-w-11 min-h-11 inline-flex items-center justify-center text-[#1B4332] hover:opacity-70 font-bold text-lg leading-none cursor-pointer"
                        aria-label="Tutup pemberitahuan"
                    >
                        &times;
                    </button>
                </div>
            )}

            {!isFlashDismissed && flash?.error && (
                <div
                    role="alert"
                    className="w-full bg-[#FEE2E2] text-[#991B1B] border-b border-[#991B1B]/30 px-4 sm:px-8 lg:px-12 xl:px-16 py-2.5 flex items-center justify-between gap-4 text-sm font-medium"
                >
                    <span>{flash.error}</span>
                    <button
                        type="button"
                        onClick={() => setDismissedFlashKey(activeFlashKey)}
                        className="min-w-11 min-h-11 inline-flex items-center justify-center text-[#991B1B] hover:opacity-70 font-bold text-lg leading-none cursor-pointer"
                        aria-label="Tutup peringatan"
                    >
                        &times;
                    </button>
                </div>
            )}

            {flash?.order_success && !isFlashDismissed && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="order-success-heading"
                >
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-[#D6D3CB]">
                        <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                            &#10003;
                        </div>
                        <h3 id="order-success-heading" className="text-xl font-bold text-center text-[#1C1917] mb-2">
                            Booking Ternak Berhasil Diterima
                        </h3>
                        <p className="text-sm text-[#57534E] text-center mb-6">
                            Nomor Pesanan: <strong className="text-[#1C1917]">#{flash.order_success.order_id}</strong> untuk ternak{' '}
                            <strong className="text-[#1C1917]">{flash.order_success.livestock_title}</strong>. Status ternak telah dikunci untuk Anda.
                        </p>

                        <div className="bg-[#F4F2EC] rounded-xl p-4 mb-6 text-sm border border-[#E7E5DF]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#57534E]">Total Pembayaran:</span>
                                <span className="font-bold text-[#1B4332] text-base tabular-nums">
                                    Rp {new Intl.NumberFormat('id-ID').format(flash.order_success.total_amount)}
                                </span>
                            </div>
                            <p className="text-xs text-[#57534E]">
                                Hubungi peternak via WhatsApp untuk video fisik terbaru, jadwal pengiriman, dan unggah bukti transfer melalui Dashboard Pembeli.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <a
                                href={flash.order_success.whatsapp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-11 inline-flex items-center text-sm font-semibold text-[#1B4332] underline underline-offset-4 hover:text-[#2D6A4F]"
                            >
                                Konfirmasi ke WhatsApp Peternak
                            </a>
                            <button
                                type="button"
                                onClick={() => setDismissedFlashKey(activeFlashKey)}
                                className="min-h-11 inline-flex items-center text-sm font-medium text-[#57534E] hover:text-[#1C1917] hover:underline underline-offset-4 cursor-pointer"
                            >
                                Tutup Dialog
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 w-full">{children}</main>

            <footer className="w-full bg-[#1B4332] text-white border-t border-[#2D6A4F] mt-16">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 lg:py-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <img src="/images/logo.png" alt="Fresh Farm" className="h-10 sm:h-12 w-auto bg-white rounded-xl p-1 object-contain" />
                                <span className="text-xl font-bold tracking-tight">{COMPANY_NAME}</span>
                            </div>
                            <p className="text-sm text-[#D8F3DC] leading-relaxed mb-4">
                                Marketplace hewan ternak yang menghubungkan peternak lokal langsung dengan pembeli kurban, aqiqah, dan usaha kuliner secara transparan.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-[#D8F3DC] mb-4">Kategori Ternak</h4>
                            <ul className="space-y-2.5 text-sm text-white/90">
                                <li><Link href="/katalog?category=sapi" className="hover:underline">Sapi Potong dan Kurban</Link></li>
                                <li><Link href="/katalog?category=kambing" className="hover:underline">Kambing Peranakan</Link></li>
                                <li><Link href="/katalog?category=domba" className="hover:underline">Domba Pedaging dan Aqiqah</Link></li>
                                <li><Link href="/katalog?category=kerbau" className="hover:underline">Kerbau Murrah dan Lumpur</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-[#D8F3DC] mb-4">Informasi &amp; Layanan</h4>
                            <ul className="space-y-2.5 text-sm text-white/90">
                                {aboutLinks.map((item) => (
                                    <li key={item.key}>
                                        <Link href={item.href} className="hover:underline">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-[#D8F3DC] mb-4">Akses Mitra &amp; Pembeli</h4>
                            <p className="text-sm text-white/90 mb-2">
                                Punya kandang ternak siap pasarkan atau ingin memantau pesanan hewan kurban Anda?
                            </p>
                            <ul className="text-sm">
                                {currentUser ? (
                                    <li>
                                        <Link href="/dashboard" className={footerLinkClass}>
                                            Buka Dashboard Saya
                                        </Link>
                                    </li>
                                ) : (
                                    <>
                                        <li>
                                            <Link href="/login" className={footerLinkClass}>
                                                Masuk Akun
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/register" className={footerLinkClass}>
                                                Daftar Peternak / Pembeli
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#2D6A4F] flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8F3DC] gap-3">
                        <p>&copy; 2026 {COMPANY_NAME}. Seluruh hak cipta dilindungi.</p>
                        <p>Transparansi Bobot Hidup dan Kesehatan Ternak Lokal</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}