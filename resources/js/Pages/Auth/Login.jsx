import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { VetShieldIcon, DigitalScaleIcon, EscrowLockIcon } from '../../Components/LivestockIcons';

const DEMO_ACCOUNTS = [
    {
        roleLabel: 'Admin Platform',
        name: 'Admin Fresh Farm',
        email: 'admin@freshfarm.id',
        desc: 'Verifikasi peternak, master kategori, dan seluruh transaksi',
    },
    {
        roleLabel: 'Mitra Peternak',
        name: 'Kandang Sapi Berkah Boyolali',
        email: 'sukirman@berkahboyolali.com',
        desc: 'CRUD inventaris ternak kandang, unggah foto, dan kelola pesanan',
    },
    {
        roleLabel: 'Pembeli',
        name: 'Panitia Kurban Masjid Al-Ikhlas',
        email: 'budi@masjid-alikhlas.org',
        desc: 'Pantau pesanan ternak dan unggah bukti pembayaran',
    },
];

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const fillDemoAccount = (email) => {
        setData((prev) => ({
            ...prev,
            email,
            password: 'password',
        }));
    };

    const hasErrors = Boolean(errors.email || errors.password);

    return (
        <AppLayout currentRoute="login">
            <Head title="Masuk Akun" />

            <section className="w-full py-10 sm:py-14 lg:py-16">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D6D3CB] p-6 sm:p-8 lg:p-10 shadow-xs order-1">
                            <div className="mb-6">
                                <p className="text-xs font-bold text-[#9A3412] mb-1.5">
                                    Otentikasi Pengguna Fresh Farm
                                </p>
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                                    Masuk ke Akun Anda
                                </h1>
                                <p className="text-sm text-[#57534E] mt-1.5 leading-relaxed">
                                    Gunakan email dan kata sandi terdaftar untuk membuka dashboard Pembeli, Mitra Peternak, atau Admin.
                                </p>
                            </div>

                            {hasErrors && (
                                <div
                                    role="alert"
                                    className="mb-6 p-4 rounded-xl bg-[#FEE2E2] border border-[#991B1B]/30 text-sm text-[#991B1B] font-medium"
                                >
                                    Gagal masuk ke akun. Periksa kembali alamat email dan kata sandi Anda.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                <div>
                                    <label
                                        htmlFor="login-email"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Alamat Email
                                    </label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        aria-invalid={Boolean(errors.email)}
                                        className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                    />
                                    {errors.email && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="login-password"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Kata Sandi
                                    </label>
                                    <div className="flex items-stretch gap-2">
                                        <input
                                            id="login-password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            autoComplete="current-password"
                                            required
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Masukkan kata sandi akun"
                                            aria-invalid={Boolean(errors.password)}
                                            className="flex-1 min-w-0 min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-pressed={showPassword}
                                            className="min-h-11 px-3.5 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] shrink-0 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <label
                                        htmlFor="login-remember"
                                        className="min-h-11 inline-flex items-center gap-2.5 text-sm text-[#1C1917] font-medium cursor-pointer select-none"
                                    >
                                        <input
                                            id="login-remember"
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-[#78716C] accent-[#1B4332]"
                                        />
                                        <span>Ingat sesi masuk di perangkat ini</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="min-h-12 w-full py-3 px-6 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-60 text-white font-semibold text-sm transition-colors cursor-pointer"
                                >
                                    {processing ? 'Memproses Masuk...' : 'Masuk ke Dashboard'}
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-[#E7E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                                <span className="text-[#57534E]">Belum memiliki akun pembeli atau kandang?</span>
                                <Link
                                    href="/register"
                                    className="min-h-11 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#78716C] bg-[#F4F2EC] hover:bg-[#D8F3DC] text-[#1B4332] font-semibold text-sm transition-colors"
                                >
                                    Daftar Akun Baru
                                </Link>
                            </div>
                        </div>

                        <aside className="lg:col-span-5 space-y-6 order-2">
                            <div className="rounded-2xl bg-[#F4F2EC] border border-[#D6D3CB] p-6">
                                <h2 className="text-base font-bold text-[#1C1917] mb-1">
                                    Akun Contoh Database Seeder
                                </h2>
                                <p className="text-xs text-[#57534E] mb-4 leading-relaxed">
                                    Data uji pengembangan lokal (kata sandi: <code className="px-1.5 py-0.5 rounded bg-white border border-[#D6D3CB] text-[#1C1917] font-semibold">password</code>). Klik salah satu peran untuk mengisi formulir otomatis:
                                </p>

                                <div className="space-y-2.5">
                                    {DEMO_ACCOUNTS.map((acc) => {
                                        const isSelected = data.email === acc.email;
                                        return (
                                            <button
                                                key={acc.email}
                                                type="button"
                                                onClick={() => fillDemoAccount(acc.email)}
                                                className={`min-h-11 w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-[#D8F3DC] border-[#1B4332]'
                                                        : 'bg-white hover:bg-[#FBFBF9] border-[#78716C]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-xs font-bold text-[#1B4332]">
                                                        {acc.roleLabel}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-[#57534E] truncate">
                                                        {acc.email}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-[#1C1917]">{acc.name}</p>
                                                <p className="text-xs text-[#57534E] mt-0.5">{acc.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </aside>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

