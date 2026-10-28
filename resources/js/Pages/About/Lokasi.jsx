import React from 'react';
import AboutShell from '../../Components/AboutShell';
import Reveal from '../../Components/Reveal';

const sites = [
    { city: 'Boyolali, Jawa Tengah', note: 'Sentra sapi potong: Limousin, Simental, dan lainnya.' },
    { city: 'Bogor, Jawa Barat', note: 'Kandang kambing dan domba untuk wilayah Jabodetabek.' },
    { city: 'Garut, Jawa Barat', note: 'Sentra domba Garut dan kambing Etawa.' },
];

export default function Lokasi() {
    return (
        <AboutShell
            routeKey="about-lokasi"
            title="Lokasi"
            intro="Kandang mitra kami tersebar di tiga kota. Pembeli dapat datang langsung untuk melihat hewan sebelum memesan."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {sites.map((site, index) => (
                    <Reveal key={site.city} delay={index * 90} className="bg-white border border-[#E7E5DF] rounded-xl p-6">
                        <h2 className="font-bold text-lg text-[#1B4332]">{site.city}</h2>
                        <p className="text-sm text-[#57534E] mt-2 leading-relaxed">{site.note}</p>
                    </Reveal>
                ))}
            </div>
            <p className="text-sm text-[#57534E] mt-6 max-w-2xl">
                Alamat lengkap kandang diberikan peternak saat pemesanan dikonfirmasi.
            </p>
        </AboutShell>
    );
}
