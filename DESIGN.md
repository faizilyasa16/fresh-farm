# Design Direction: Fresh Farm

Dokumen arahan desain visual untuk platform marketplace hewan ternak **Fresh Farm**.

## 1. Identitas & Karakter Produk (Identity)
- **Nama Produk**: Fresh Farm
- **Fungsi**: Marketplace hewan ternak terpercaya yang menghubungkan peternak lokal (sapi, kambing, domba, kerbau) langsung dengan pembeli (individu, panitia kurban, aqiqah, dan usaha kuliner).
- **Karakter**: Otentik, membumi (*earthy*), transparan dalam spesifikasi ternak (bobot, sertifikat PMK, umur, ras), dan profesional. Bukan template software korporat dan bukan AI slop bertema futuristik.

## 2. Palet Warna (Palette)
Menggunakan palet *Earthy Livestock & Farm* yang hangat, alami, dan berkontras tinggi:
- **Primary / Brand Base**: `#1B4332` (Deep Forest Green) - melambangkan padang rumput segar, ketegasan, dan kepercayaan.
- **Secondary / Accent Light**: `#2D6A4F` & `#D8F3DC` (Sage tint) - untuk kontras elemen sekunder, badge status sehat, filter aktif.
- **Surface & Background**:
  - Halaman Utama: `#FBFBF9` (Warm Natural Off-White / Paper Cream)
  - Surface Card & Container: `#FFFFFF` dengan border halus `#E7E5E0`
  - Kontainer Sekunder / Section Terang: `#F4F2EC` (Warm Sand)
- **Accent Action**: `#C2410C` / `#D97706` (Warm Terracotta / Amber) - untuk tombol aksi kunci (Beli / Pesan Ternak) agar terlihat jelas dan natural.
- **Teks**:
  - Teks Utama: `#1C1917` (Stone Charcoal, WCAG AAA rasio 12:1+)
  - Teks Sekunder: `#57534E` (Stone Muted, WCAG AA rasio 5.5:1+)
- **Larangan Khusus**:
  - TIDAK menggunakan gradien ungu, biru-ke-cyan, atau neon glow khas AI slop.
  - Tidak menggunakan background grid/blueprint buatan AI.

## 3. Tipografi (Typography)
- **Font Utama**: `Poppins`, sans-serif (Google Fonts: weights 400, 500, 600, 700).
- **Skala Hierarki**:
  - Headline H1: 2.25rem - 2.75rem, font-weight 700, line-height 1.2
  - Subhead / Section Title H2: 1.5rem - 1.75rem, font-weight 600, line-height 1.3
  - Card Title / H3: 1.125rem, font-weight 600
  - Body Text: 0.9375rem - 1rem, font-weight 400 & 500, line-height 1.6
  - Keterangan & Meta (bobot, umur, ras): 0.8125rem - 0.875rem, font-weight 500
- **Larangan Tipografi**:
  - Dilarang menggunakan font monospace besar tanpa konteks kode/terminal.
  - Dilarang menggunakan label uppercase dengan tracking berlebihan.

## 4. Dials Antislop
- **ENERGY**: 2 (Tenang, hangat, terpercaya, berbobot).
- **RHYTHM**: 2 (Variasi terstruktur: Hero komprehensif dengan filter cepat -> Katalog eksplorasi interaktif -> Spesifikasi detail -> Transparansi alur verifikasi peternak).
- **MOTION**: 1 (Hanya mikro-interaksi fungsional: hover state kartu, transisi pembukaan modal detail, feedback tombol filter dan checkout. Tanpa animasi looping/pulsing tiada henti).

## 5. Komponen & Aset
- **Iconography**: Ikon siluet hewan ternak yang jelas (Sapi, Kambing, Domba, Kerbau) dan indikator fungsional (timbangan kg, sertifikat vaksin PMK terverifikasi, pin lokasi kandang, garansi kirim armada ternak).
- **Tombol & Kontrol**: Radius sedang (8px - 10px), bukan pil bulat berlebihan. Shadow elevasi tipis dan natural (`0 2px 8px rgba(28,25,23,0.06)`).
- **Status Data**: Setiap status (Tersedia, Dipesan, Terjual) menggunakan badge status fungsional dengan warna bermakna, bukan pill kapsul neon.
