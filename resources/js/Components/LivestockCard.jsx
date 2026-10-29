import React, { memo } from 'react';
import { Link } from '@inertiajs/react';

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export function formatRupiah(value) {
    return rupiahFormatter.format(Number(value) || 0);
}

const LivestockCard = memo(function LivestockCard({ livestock, contain = false }) {
    const primaryImage = livestock.images?.[0]?.image_url || '/images/hero-farm.jpg';
    const pricePerKg = livestock.weight_kg > 0
        ? Math.round(Number(livestock.price) / Number(livestock.weight_kg)).toLocaleString('id-ID')
        : '0';

    return (
        <article
            className={`relative h-full bg-white rounded-2xl overflow-hidden border border-[#D6D3CB] hover:border-[#1B4332] transition-colors duration-150 flex flex-col ${
                contain ? 'catalog-card-contain' : ''
            }`}
        >
            <div className="relative aspect-4/3 overflow-hidden bg-[#F4F2EC]">
                <img
                    src={primaryImage}
                    alt={livestock.title}
                    width="600"
                    height="450"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                />

                <div className="absolute bottom-3 right-3 bg-[#1C1917]/90 text-white text-xs px-2.5 py-1 rounded-md font-semibold tabular-nums">
                    {livestock.weight_kg} kg
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#57534E] mb-1.5">
                        <span className="font-semibold text-[#9A3412] truncate">
                            Ras {livestock.breed}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                            <svg className="w-3.5 h-3.5 text-[#57534E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{livestock.seller?.city || 'Indonesia'}</span>
                        </span>
                    </div>

                    <h3 className="font-bold text-base text-[#1C1917] leading-snug line-clamp-2 mb-3">
                        {/* Stretched link: after:inset-0 bikin seluruh card bisa diklik */}
                        <Link
                            href={`/livestock/${livestock.id}`}
                            className="hover:text-[#1B4332] transition-colors rounded-sm after:absolute after:inset-0 after:content-['']"
                        >
                            {livestock.title}
                        </Link>
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#57534E] bg-[#FBFBF9] p-2.5 rounded-lg mb-4 border border-[#E7E5DF]">
                        <div>
                            <span className="block text-[11px] text-[#57534E]">Jenis Kelamin</span>
                            <strong className="text-[#1C1917] font-semibold">
                                {livestock.gender === 'male' ? 'Jantan' : 'Betina'}
                            </strong>
                        </div>
                        <div>
                            <span className="block text-[11px] text-[#57534E]">Umur Hewan</span>
                            <strong className="text-[#1C1917] font-semibold tabular-nums">
                                {livestock.age_months} Bulan
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-[#E7E5DF]">
                    <div className="flex items-baseline justify-between gap-2 mb-3">
                        <div>
                            <span className="text-[11px] text-[#57534E] block">Harga Peternak</span>
                            <span className="text-lg font-bold text-[#1B4332] tabular-nums">
                                {formatRupiah(livestock.price)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[11px] text-[#57534E] block">Estimasi / kg</span>
                            <span className="text-xs font-semibold text-[#57534E] tabular-nums">
                                Rp {pricePerKg}
                            </span>
                        </div>
                    </div>

                    {/* relative z-10 supaya tombol ini tetap di atas stretched link */}
                    <Link
                        href={`/checkout/${livestock.id}`}
                        className="relative z-10 min-h-11 w-full inline-flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-semibold text-white transition-colors text-center"
                    >
                        Booking Ternak
                    </Link>
                </div>
            </div>
        </article>
    );
});

export default LivestockCard;