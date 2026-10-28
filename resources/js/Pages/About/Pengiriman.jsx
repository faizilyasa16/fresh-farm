import React from 'react';
import AboutShell from '../../Components/AboutShell';
import Reveal from '../../Components/Reveal';

const options = [
    {
        title: 'Armada angkut khusus ternak',
        price: 'Sapi dan kerbau Rp 650.000, kambing dan domba Rp 350.000',
        body: 'Hewan diantar dengan truk atau pick-up berventilasi, beralas jerami, dengan pakan rumput selama perjalanan dan pendamping.',
    },
    {
        title: 'Ambil sendiri di kandang',
        price: 'Gratis',
        body: 'Bawa kendaraan sendiri ke kandang peternak. Serah terima dan penimbangan ulang dilakukan di tempat.',
    },
];

export default function Pengiriman() {
    return (
        <AboutShell
            routeKey="about-pengiriman"
            title="Pengiriman"
            intro="Dua pilihan penerimaan hewan. Pilih saat mengisi formulir booking."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
                {options.map((option, index) => (
                    <Reveal key={option.title} delay={index * 100} className="bg-white border border-[#E7E5DF] rounded-xl p-6">
                        <h2 className="font-bold text-lg text-[#1C1917]">{option.title}</h2>
                        <p className="text-sm font-semibold text-[#1B4332] mt-1">{option.price}</p>
                        <p className="text-sm text-[#57534E] mt-3 leading-relaxed">{option.body}</p>
                    </Reveal>
                ))}
            </div>
            <p className="text-sm text-[#57534E] mt-6 max-w-2xl">
                Peternak mengirim video kondisi terbaru hewan sebelum diberangkatkan.
            </p>
        </AboutShell>
    );
}
