import React from 'react';
import AboutShell from '../../Components/AboutShell';
import Reveal from '../../Components/Reveal';

export default function Hubungi() {
    return (
        <AboutShell
            routeKey="about-hubungi"
            title="Hubungi Kami"
            intro="Tanyakan ketersediaan hewan, kunjungan kandang, atau proses pemesanan langsung ke tim kami."
        >
            <div className="max-w-2xl space-y-4">
                <div className="anim-slide-right bg-white border border-[#E7E5DF] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                        <h2 className="font-bold text-[#1C1917]">WhatsApp</h2>
                        <p className="text-sm text-[#57534E] mt-1">0812-3456-7890</p>
                    </div>
                    <a
                        href="https://wa.me/6281234567890?text=Halo%20Fresh%20Farm,%20saya%20ingin%20bertanya%20seputar%20hewan%20ternak"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center px-5 py-3 rounded-lg bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-sm font-semibold transition"
                    >
                        Chat via WhatsApp
                    </a>
                </div>

                <Reveal className="bg-white border border-[#E7E5DF] rounded-xl p-5 sm:p-6">
                    <h2 className="font-bold text-[#1C1917]">Sebelum menghubungi</h2>
                    <p className="text-sm text-[#57534E] mt-1 leading-relaxed">
                        Sebutkan nomor ID hewan atau judul listing yang Anda minati agar kami bisa langsung memeriksa ketersediaannya.
                    </p>
                </Reveal>
            </div>
        </AboutShell>
    );
}
