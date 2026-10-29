import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        role: 'buyer',
        name: '',
        email: '',
        phone_number: '',
        city: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const isSeller = data.role === 'seller';
    const errorCount = Object.keys(errors).length;

    return (
        <AppLayout currentRoute="register">
            <Head title="Daftar Akun Baru" />

            <section className="w-full py-10 sm:py-14">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#D6D3CB] p-6 sm:p-8 lg:p-10 shadow-xs">
                        <div className="mb-6">
                            <p className="text-xs font-bold text-[#9A3412] mb-1.5">
                                Registrasi Pengguna Baru
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                                Buat Akun Fresh Farm
                            </h1>
                            <p className="text-sm text-[#57534E] mt-1.5 leading-relaxed">
                                Pilih peran akun sesuai kebutuhan Anda untuk membeli ternak terverifikasi atau memasarkan ternak langsung dari kandang.
                            </p>
                        </div>

                        {errorCount > 0 && (
                            <div
                                role="alert"
                                className="mb-6 p-4 rounded-xl bg-[#FEE2E2] border border-[#991B1B]/30 text-sm text-[#991B1B] font-medium"
                            >
                                Terdapat {errorCount} kolom yang perlu diperbaiki pada formulir pendaftaran di bawah.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <fieldset>
                                <legend className="block text-sm font-semibold text-[#1C1917] mb-2.5">
                                    Pilih Jenis Akun *
                                </legend>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <label
                                        className={`min-h-11 p-4 rounded-xl border-2 cursor-pointer transition-colors flex flex-col justify-between ${
                                            data.role === 'buyer'
                                                ? 'border-[#1B4332] bg-[#F2FBF5]'
                                                : 'border-[#78716C] bg-white hover:bg-[#F4F2EC]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className="text-sm font-bold text-[#1C1917]">
                                                Pembeli Ternak
                                            </span>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="buyer"
                                                checked={data.role === 'buyer'}
                                                onChange={() => setData('role', 'buyer')}
                                                className="w-4 h-4 accent-[#1B4332]"
                                            />
                                        </div>
                                        <p className="text-xs text-[#57534E] leading-relaxed">
                                            Untuk panitia kurban, keluarga aqiqah, atau usaha kuliner yang memesan ternak siap kirim.
                                        </p>
                                    </label>

                                    <label
                                        className={`min-h-11 p-4 rounded-xl border-2 cursor-pointer transition-colors flex flex-col justify-between ${
                                            data.role === 'seller'
                                                ? 'border-[#1B4332] bg-[#F2FBF5]'
                                                : 'border-[#78716C] bg-white hover:bg-[#F4F2EC]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className="text-sm font-bold text-[#1C1917]">
                                                Mitra Peternak / Kandang
                                            </span>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="seller"
                                                checked={data.role === 'seller'}
                                                onChange={() => setData('role', 'seller')}
                                                className="w-4 h-4 accent-[#1B4332]"
                                            />
                                        </div>
                                        <p className="text-xs text-[#57534E] leading-relaxed">
                                            Untuk peternak atau pemilik kandang sapi, kambing, unggas/ayam, babi, dan aneka ternak yang ingin menjual ternak sendiri.
                                        </p>
                                    </label>
                                </div>
                                {errors.role && (
                                    <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.role}</p>
                                )}

                                {isSeller && (
                                    <p className="mt-3 p-3 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] text-xs text-[#1C1917] leading-relaxed">
                                        Catatan Mitra Peternak: Anda dapat langsung mengelola stok kandang setelah mendaftar. Tanda verifikasi kandang akan diaktifkan setelah peninjauan Admin Fresh Farm.
                                    </p>
                                )}
                            </fieldset>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="reg-name"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        {isSeller ? 'Nama Kandang / Peternakan *' : 'Nama Lengkap atau Instansi *'}
                                    </label>
                                    <input
                                        id="reg-name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={
                                            isSeller
                                                ? 'Contoh: Kandang Sapi Mulia Boyolali'
                                                : 'Contoh: Ahmad Fauzi (DKM Al-Falah)'
                                        }
                                        className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                    />
                                    {errors.name && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="reg-email"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Alamat Email *
                                    </label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                    />
                                    {errors.email && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="reg-phone"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Nomor WhatsApp Aktif *
                                    </label>
                                    <input
                                        id="reg-phone"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        placeholder="081234567890"
                                        className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                    />
                                    {errors.phone_number && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.phone_number}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="reg-city"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Kota / Kabupaten *
                                    </label>
                                    <input
                                        id="reg-city"
                                        type="text"
                                        required
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder={isSeller ? 'Contoh: Boyolali, Jawa Tengah' : 'Contoh: Kota Bekasi, Jawa Barat'}
                                        className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                    />
                                    {errors.city && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.city}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="reg-address"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        {isSeller ? 'Alamat Lengkap Lokasi Kandang *' : 'Alamat Pengiriman Utama *'}
                                    </label>
                                    <textarea
                                        id="reg-address"
                                        rows={3}
                                        required
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder={
                                            isSeller
                                                ? 'Jalan, desa, kecamatan, dan patokan akses armada truk kandang'
                                                : 'Jalan, nomor bangunan, RT/RW, kelurahan, dan kecamatan'
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                    />
                                    {errors.address && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.address}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="reg-password"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Kata Sandi (Minimal 8 Karakter) *
                                    </label>
                                    <input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                    />
                                    {errors.password && (
                                        <p className="text-xs font-medium text-[#991B1B] mt-1.5">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="reg-password-confirm"
                                        className="block text-sm font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Ulangi Kata Sandi *
                                    </label>
                                    <div className="flex items-stretch gap-2">
                                        <input
                                            id="reg-password-confirm"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ketik ulang kata sandi"
                                            className="flex-1 min-w-0 min-h-11 px-4 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] placeholder-[#57534E]/70 focus:bg-white focus:border-[#1B4332]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-pressed={showPassword}
                                            className="min-h-11 px-3 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] shrink-0 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? 'Tutup' : 'Lihat'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="min-h-12 w-full py-3 px-6 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-60 text-white font-semibold text-sm transition-colors cursor-pointer"
                            >
                                {processing
                                    ? 'Mendaftarkan Akun...'
                                    : isSeller
                                      ? 'Daftar sebagai Mitra Peternak'
                                      : 'Daftar sebagai Pembeli'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-[#E7E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                            <span className="text-[#57534E]">Sudah terdaftar di Fresh Farm?</span>
                            <Link
                                href="/login"
                                className="min-h-11 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#78716C] bg-[#F4F2EC] hover:bg-[#D8F3DC] text-[#1B4332] font-semibold text-sm transition-colors"
                            >
                                Masuk ke Akun
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

