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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                {options.map((option, index) => (
                    <Reveal
                        key={option.title}
                        delay={index * 100}
                        className="bg-white border border-[#E7E5DF] rounded-xl p-6 lg:p-8"
                    >
                        <h2 className="font-bold text-lg lg:text-xl text-[#1C1917]">{option.title}</h2>
                        <p className="text-sm lg:text-base font-semibold text-[#1B4332] mt-1">{option.price}</p>
                        <p className="text-sm lg:text-base text-[#57534E] mt-3 leading-relaxed">{option.body}</p>
                    </Reveal>
                ))}
            </div>
            <p className="text-sm lg:text-base text-[#57534E] mt-6">
                Peternak mengirim video kondisi terbaru hewan sebelum diberangkatkan.
            </p>
        </AboutShell>
    );
}
