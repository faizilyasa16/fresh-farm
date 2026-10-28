import React from 'react';
import AboutShell from '../../Components/AboutShell';
import Reveal from '../../Components/Reveal';

export default function Kami() {
    return (
        <AboutShell
            routeKey="about-kami"
            title="Tentang Kami"
            intro="Fresh Farm adalah marketplace hewan ternak yang menghubungkan peternak lokal langsung dengan pembeli kurban, aqiqah, dan usaha peternakan."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-7 space-y-5 text-[#57534E] leading-relaxed anim-fade-up">
                    <p>
                        Kami memangkas rantai perantara agar peternak mendapat harga yang layak dan pembeli mendapat hewan dengan bobot, umur, dan status kesehatan yang tercatat jelas sebelum memesan.
                    </p>
                    <p>
                        Setiap hewan dipajang lengkap dengan ras, jenis kelamin, bobot hidup, umur, dan lokasi kandang. Pemesanan dikunci begitu booking dikonfirmasi, sehingga hewan tidak bisa dipesan pembeli lain.
                    </p>
                    <p>
                        Kami bermitra dengan peternak di Boyolali, Bogor, dan Garut.
                    </p>
                </div>

                <div className="lg:col-span-5 space-y-4">
                    <Reveal className="bg-white border border-[#E7E5DF] rounded-xl p-5">
                        <h2 className="font-bold text-[#1B4332]">Bobot dan umur tercatat</h2>
                        <p className="text-sm text-[#57534E] mt-1">Data bobot hidup dan umur ditampilkan di setiap kartu hewan.</p>
                    </Reveal>
                    <Reveal delay={80} className="bg-white border border-[#E7E5DF] rounded-xl p-5">
                        <h2 className="font-bold text-[#1B4332]">Langsung dari peternak</h2>
                        <p className="text-sm text-[#57534E] mt-1">Pembeli berhubungan dengan peternak untuk video fisik dan jadwal pengiriman.</p>
                    </Reveal>
                    <Reveal delay={160} className="bg-white border border-[#E7E5DF] rounded-xl p-5">
                        <h2 className="font-bold text-[#1B4332]">Status hewan terkunci</h2>
                        <p className="text-sm text-[#57534E] mt-1">Setelah booking, hewan ditandai Booked dan hilang dari katalog.</p>
                    </Reveal>
                </div>
            </div>
        </AboutShell>
    );
}
