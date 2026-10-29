import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import { formatRupiah } from "../Components/LivestockCard";

export default function Checkout({ livestock }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || null;

    const isBigAnimal = ["sapi", "kerbau"].includes(livestock.category?.slug);
    const courierRate = isBigAnimal ? 650000 : 350000;

    const { data, setData, post, processing, errors } = useForm({
        livestock_id: livestock.id,
        buyer_name: currentUser?.name || "",
        buyer_phone: currentUser?.phone_number || "",
        shipping_address: currentUser?.address || "",
        delivery_method: "courier",
        notes: "",
        payment_proof: null,
    });

    const shippingCost = data.delivery_method === "courier" ? courierRate : 0;
    const totalAmount = Number(livestock.price) + shippingCost;

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/orders", {
            forceFormData: true,
        });
    };

    const primaryImage =
        livestock.images?.[0]?.image_url || "/images/hero-farm.jpg";

    return (
        <AppLayout currentRoute="catalog">
            <Head title={`Booking dan Checkout: ${livestock.title}`} />

            <div className="w-full bg-[#F4F2EC] border-b border-[#D6D3CB] py-4">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <nav
                        className="flex items-center gap-2 text-xs font-semibold text-[#57534E] flex-wrap"
                        aria-label="Breadcrumb"
                    >
                        <Link
                            href="/"
                            className="hover:text-[#1B4332] hover:underline"
                        >
                            Beranda
                        </Link>
                        <span>/</span>
                        <Link
                            href="/katalog"
                            className="hover:text-[#1B4332] hover:underline"
                        >
                            Katalog
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/livestock/${livestock.id}`}
                            className="hover:text-[#1B4332] hover:underline truncate max-w-xs"
                        >
                            {livestock.title}
                        </Link>
                        <span>/</span>
                        <span className="text-[#1C1917]">
                            Checkout dan Booking
                        </span>
                    </nav>
                </div>
            </div>

            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10">
                <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                            Formulir Pemesanan Hewan Ternak
                        </h1>
                        <p className="text-sm sm:text-base text-[#57534E] mt-1.5 max-w-3xl">
                            Lengkapi alamat dan metode penerimaan. Begitu
                            pesanan dibuat, status hewan langsung dikunci agar
                            tidak dipesan pembeli lain.
                        </p>
                    </div>
                    {!currentUser && (
                        <div className="text-xs text-[#57534E] bg-[#F4F2EC] px-4 py-3 rounded-xl border border-[#D6D3CB]">
                            Sudah punya akun?{" "}
                            <Link
                                href="/login"
                                className="font-bold text-[#1B4332] underline"
                            >
                                Masuk di sini
                            </Link>{" "}
                            agar pesanan tersimpan di Dashboard Pembeli.
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    <div className="lg:col-span-7 xl:col-span-8 bg-white p-5 sm:p-7 lg:p-8 rounded-2xl border border-[#D6D3CB]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label
                                        htmlFor="buyer_name"
                                        className="block text-xs font-bold text-[#1C1917] mb-2"
                                    >
                                        Nama Lengkap Pemesan{" "}
                                        <span className="text-[#991B1B]">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="buyer_name"
                                        type="text"
                                        required
                                        value={data.buyer_name}
                                        onChange={(e) =>
                                            setData(
                                                "buyer_name",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan nama lengkap atau nama panitia"
                                        className={`min-h-11 w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C1917] bg-[#FBFBF9] ${
                                            errors.buyer_name
                                                ? "border-[#991B1B]"
                                                : "border-[#78716C]"
                                        }`}
                                    />
                                    {errors.buyer_name && (
                                        <p className="text-xs text-[#991B1B] mt-1">
                                            {errors.buyer_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="buyer_phone"
                                        className="block text-xs font-bold text-[#1C1917] mb-2"
                                    >
                                        Nomor WhatsApp Aktif{" "}
                                        <span className="text-[#991B1B]">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="buyer_phone"
                                        type="tel"
                                        required
                                        value={data.buyer_phone}
                                        onChange={(e) =>
                                            setData(
                                                "buyer_phone",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0812xxxxxxxx"
                                        className={`min-h-11 w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C1917] bg-[#FBFBF9] ${
                                            errors.buyer_phone
                                                ? "border-[#991B1B]"
                                                : "border-[#78716C]"
                                        }`}
                                    />
                                    <p className="text-[11px] text-[#57534E] mt-1.5">
                                        Digunakan peternak untuk mengirim video
                                        fisik terbaru dan koordinasi pengiriman.
                                    </p>
                                    {errors.buyer_phone && (
                                        <p className="text-xs text-[#991B1B] mt-1">
                                            {errors.buyer_phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-[#1C1917] mb-2">
                                    Metode Pengiriman Ternak{" "}
                                    <span className="text-[#991B1B]">*</span>
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    <label
                                        className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-xl border cursor-pointer transition-colors ${
                                            data.delivery_method === "courier"
                                                ? "border-[#1B4332] bg-[#D8F3DC]/35 ring-1 ring-[#1B4332]"
                                                : "border-[#78716C] bg-[#FBFBF9] hover:bg-[#F4F2EC]"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="courier"
                                            checked={
                                                data.delivery_method ===
                                                "courier"
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "delivery_method",
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 text-[#1B4332] w-4 h-4"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-baseline justify-between gap-1">
                                                <span className="font-bold text-sm text-[#1C1917]">
                                                    Diantar Kurir Ternak
                                                </span>
                                                <span className="font-bold text-sm text-[#1B4332] tabular-nums">
                                                    {formatRupiah(courierRate)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                                                Diantar armada khusus ternak
                                                berventilasi, alas jerami, dan
                                                pakan hijauan selama perjalanan.
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-xl border cursor-pointer transition-colors ${
                                            data.delivery_method === "pickup"
                                                ? "border-[#1B4332] bg-[#D8F3DC]/35 ring-1 ring-[#1B4332]"
                                                : "border-[#78716C] bg-[#FBFBF9] hover:bg-[#F4F2EC]"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="pickup"
                                            checked={
                                                data.delivery_method ===
                                                "pickup"
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "delivery_method",
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 text-[#1B4332] w-4 h-4"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-baseline justify-between gap-1">
                                                <span className="font-bold text-sm text-[#1C1917]">
                                                    Ambil di Kandang
                                                </span>
                                                <span className="font-bold text-sm text-[#1B4332]">
                                                    Gratis (Rp 0)
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                                                Jemput langsung ke kandang mitra
                                                di{" "}
                                                {livestock.seller?.city ||
                                                    "lokasi peternak"}{" "}
                                                dengan timbang ulang di tempat.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                {errors.delivery_method && (
                                    <p className="text-xs text-[#991B1B] mt-1">
                                        {errors.delivery_method}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="shipping_address"
                                    className="block text-xs font-bold text-[#1C1917] mb-2"
                                >
                                    Alamat Lengkap Pengiriman / Domisili{" "}
                                    <span className="text-[#991B1B]">*</span>
                                </label>
                                <textarea
                                    id="shipping_address"
                                    rows={3}
                                    required
                                    value={data.shipping_address}
                                    onChange={(e) =>
                                        setData(
                                            "shipping_address",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Tulis nama jalan, nomor bangunan, kelurahan, kecamatan, dan kota/kabupaten..."
                                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1917] bg-[#FBFBF9] ${
                                        errors.shipping_address
                                            ? "border-[#991B1B]"
                                            : "border-[#78716C]"
                                    }`}
                                />
                                {errors.shipping_address && (
                                    <p className="text-xs text-[#991B1B] mt-1">
                                        {errors.shipping_address}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label
                                        htmlFor="notes"
                                        className="block text-xs font-bold text-[#1C1917] mb-2"
                                    >
                                        Catatan Pengiriman (Opsional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={2}
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        placeholder="Jadwal tiba yang diinginkan atau permintaan khusus..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#78716C] text-sm text-[#1C1917] bg-[#FBFBF9]"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="payment_proof"
                                        className="block text-xs font-bold text-[#1C1917] mb-2"
                                    >
                                        Unggah Bukti Pembayaran (Opsional, dapat
                                        menyusul di Dashboard)
                                    </label>
                                    <input
                                        id="payment_proof"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) =>
                                            setData(
                                                "payment_proof",
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="min-h-11 w-full px-3 py-2 rounded-xl border border-[#78716C] text-xs text-[#1C1917] bg-[#FBFBF9] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1B4332] file:text-white file:font-semibold"
                                    />
                                    <p className="text-[11px] text-[#57534E] mt-1">
                                        Format JPG, PNG, atau WebP maksimal 4
                                        MB.
                                    </p>
                                    {errors.payment_proof && (
                                        <p className="text-xs text-[#991B1B] mt-1">
                                            {errors.payment_proof}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="min-h-11 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white font-bold text-base transition-colors cursor-pointer"
                                >
                                    {processing
                                        ? "Memproses Pemesanan..."
                                        : "Konfirmasi Booking Ternak Sekarang"}
                                </button>
                                <p className="text-xs text-[#57534E] text-center mt-3">
                                    Status ternak otomatis dikunci ke Booked dan
                                    pembayaran diverifikasi melalui bukti
                                    transfer resmi.
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-24">
                        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D6D3CB]">
                            <h2 className="font-bold text-sm text-[#1C1917] pb-3 mb-4 border-b border-[#E7E5DF]">
                                Ringkasan Pesanan
                            </h2>

                            <div className="flex gap-4 pb-4 mb-4 border-b border-[#E7E5DF]">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F4F2EC] shrink-0 border border-[#D6D3CB]">
                                    <img
                                        src={primaryImage}
                                        alt={livestock.title}
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-bold text-[#9A3412] block">
                                        {livestock.breed} &bull;{" "}
                                        {livestock.gender === "male"
                                            ? "Jantan"
                                            : "Betina"}
                                    </span>
                                    <h3 className="font-bold text-sm text-[#1C1917] leading-snug line-clamp-2 mt-0.5">
                                        {livestock.title}
                                    </h3>
                                    <p className="text-xs text-[#57534E] mt-1">
                                        Bobot:{" "}
                                        <strong className="text-[#1C1917] tabular-nums">
                                            {livestock.weight_kg} kg
                                        </strong>
                                    </p>
                                    <p className="text-xs text-[#57534E]">
                                        Kandang:{" "}
                                        {livestock.seller?.city || "Indonesia"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-[#57534E]">
                                <div className="flex justify-between items-center">
                                    <span>Harga Hewan Ternak</span>
                                    <span className="font-semibold text-[#1C1917] tabular-nums">
                                        {formatRupiah(livestock.price)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span>Biaya Pengiriman</span>
                                    <span className="font-semibold text-[#1C1917] tabular-nums">
                                        {shippingCost > 0
                                            ? formatRupiah(shippingCost)
                                            : "Gratis (Ambil di Kandang)"}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-[#E7E5DF] flex justify-between items-baseline">
                                    <span className="font-bold text-base text-[#1C1917]">
                                        Total Tagihan
                                    </span>
                                    <span className="font-bold text-2xl text-[#1B4332] tabular-nums">
                                        {formatRupiah(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F4F2EC] p-5 rounded-2xl border border-[#D6D3CB] text-xs space-y-2.5 text-[#57534E]">
                            <h3 className="font-bold text-[#1B4332] text-sm">
                                Ketentuan Pemesanan Fresh Farm
                            </h3>
                            <p>
                                &bull; Status hewan langsung dikunci ke Booked
                                agar tidak dipesan pembeli lain.
                            </p>
                            <p>
                                &bull; Peternak mengirimkan dokumentasi video
                                fisik terbaru sebelum jadwal kirim.
                            </p>
                            <p>
                                &bull; Pembeli dapat mengunggah bukti transfer
                                kapan saja melalui halaman Dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
