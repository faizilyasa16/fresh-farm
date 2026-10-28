import React from 'react';
import AboutShell from '../../Components/AboutShell';
import Reveal from '../../Components/Reveal';

const items = [
    {
        title: 'Hewan sehat dan bebas PMK',
        body: 'Setiap hewan dilengkapi surat keterangan kesehatan hewan (SKKH) dan status vaksinasi PMK.',
    },
    {
        title: 'Bobot dapat diverifikasi',
        body: 'Bobot ditimbang digital dan dapat ditimbang ulang saat serah terima. Toleransi susut wajar pengiriman maksimal 3%.',
    },
    {
        title: 'Penggantian saat bermasalah di jalan',
        body: 'Jika hewan mati atau cedera berat selama perjalanan, hewan diganti.',
    },
    {
        title: 'Pembayaran lewat rekening bersama',
        body: 'Dana diteruskan ke peternak setelah hewan diterima pembeli dalam kondisi baik.',
    },
];

export default function Garansi() {
    return (
        <AboutShell
            routeKey="about-garansi"
            title="Tentang Garansi"
            intro="Jaminan yang berlaku untuk setiap transaksi di Fresh Farm."
        >
            <ol className="max-w-3xl space-y-4">
                {items.map((item, index) => (
                    <Reveal as="li" key={item.title} delay={index * 70} className="bg-white border border-[#E7E5DF] rounded-xl p-5 sm:p-6 flex gap-4">
                        <span className="shrink-0 w-9 h-9 rounded-lg bg-[#D8F3DC] text-[#1B4332] font-bold flex items-center justify-center">
                            {index + 1}
                        </span>
                        <div>
                            <h2 className="font-bold text-[#1C1917]">{item.title}</h2>
                            <p className="text-sm text-[#57534E] mt-1 leading-relaxed">{item.body}</p>
                        </div>
                    </Reveal>
                ))}
            </ol>
        </AboutShell>
    );
}
