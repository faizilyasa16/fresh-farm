<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Livestock;
use App\Models\LivestockImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@freshfarm.id'],
            [
                'name' => 'Admin Utama Fresh Farm',
                'password' => Hash::make('password'),
                'phone_number' => '081200001111',
                'role' => 'admin',
                'address' => 'Gedung Agribisnis Lt. 3, Jl. Margonda',
                'city' => 'Depok',
                'email_verified_at' => now(),
            ]
        );

        $seller1 = User::firstOrCreate(
            ['email' => 'sukirman@berkahboyolali.com'],
            [
                'name' => 'H. Sukirman (Kandang Berkah Boyolali)',
                'password' => Hash::make('password'),
                'phone_number' => '081234567890',
                'role' => 'seller',
                'address' => 'Desa Tanduk, Kec. Ampel, Kaki Gn. Merbabu',
                'city' => 'Boyolali',
                'email_verified_at' => now(),
            ]
        );

        $seller2 = User::firstOrCreate(
            ['email' => 'ridwan@aqiqahmandiri.id'],
            [
                'name' => 'Ustadz Ridwan (Aqiqah & Ternak Mandiri)',
                'password' => Hash::make('password'),
                'phone_number' => '081398765432',
                'role' => 'seller',
                'address' => 'Jl. Babakan Tengah No. 22, Cikarawang',
                'city' => 'Bogor',
                'email_verified_at' => now(),
            ]
        );

        $seller3 = User::firstOrCreate(
            ['email' => 'asep@dombagarut.id'],
            [
                'name' => 'Kang Asep (Padepokan Domba Garut)',
                'password' => Hash::make('password'),
                'phone_number' => '082155443322',
                'role' => 'seller',
                'address' => 'Kampung Babakan, Tarogong Kidul',
                'city' => 'Garut',
                'email_verified_at' => now(),
            ]
        );

        $buyer = User::firstOrCreate(
            ['email' => 'budi@masjid-alikhlas.org'],
            [
                'name' => 'Budi Santoso (Panitia Kurban Masjid Al-Ikhlas)',
                'password' => Hash::make('password'),
                'phone_number' => '081122334455',
                'role' => 'buyer',
                'address' => 'Jl. Riau No. 45',
                'city' => 'Bandung',
                'email_verified_at' => now(),
            ]
        );

        foreach ([$admin, $seller1, $seller2, $seller3, $buyer] as $seededUser) {
            if ($seededUser->email_verified_at === null) {
                $seededUser->forceFill(['email_verified_at' => now()])->save();
            }
        }

        // 2. Seed Categories
        $catSapi = Category::firstOrCreate(
            ['slug' => 'sapi'],
            ['name' => 'Sapi', 'icon_url' => 'sapi', 'image_url' => '/images/sapi-limousin.jpg']
        );

        $catKambing = Category::firstOrCreate(
            ['slug' => 'kambing'],
            ['name' => 'Kambing', 'icon_url' => 'kambing', 'image_url' => '/images/kambing-etawa.jpg']
        );

        $catDomba = Category::firstOrCreate(
            ['slug' => 'domba'],
            ['name' => 'Domba', 'icon_url' => 'domba', 'image_url' => '/images/domba-garut.jpg']
        );

        $catKerbau = Category::firstOrCreate(
            ['slug' => 'kerbau'],
            ['name' => 'Kerbau', 'icon_url' => 'kerbau', 'image_url' => '/images/kerbau-murrah.jpg']
        );

        // 3. Seed Livestocks
        $livestockData = [
            [
                'seller_id' => $seller1->id,
                'category_id' => $catSapi->id,
                'title' => 'Sapi Limousin Super Bobot 780kg Siap Kurban',
                'breed' => 'Limousin',
                'gender' => 'male',
                'weight_kg' => 780.00,
                'age_months' => 28,
                'price' => 38500000,
                'stock' => 1,
                'health_status' => 'Sudah Vaksin PMK 2x & Bersertifikat Dinas',
                'description' => 'Sapi jantan Limousin unggulan dengan punggung lurus dan dada bidang. Nafsu makan tinggi dengan pakan konsentrat fermentasi dan rumput gajah segar. Sangat cocok untuk kurban pejabat/perusahaan atau panitia masjid besar.',
                'status' => 'available',
                'image' => '/images/sapi-limousin.jpg',
            ],
            [
                'seller_id' => $seller1->id,
                'category_id' => $catSapi->id,
                'title' => 'Sapi Simental Bobot Jumbo 850kg Kualitas Utama',
                'breed' => 'Simental',
                'gender' => 'male',
                'weight_kg' => 850.00,
                'age_months' => 32,
                'price' => 45000000,
                'stock' => 1,
                'health_status' => 'Vaksin PMK & LSD Lengkap, SKKH Aktif',
                'description' => 'Simental jantan dengan corak khas kepala putih dan lingkar dada besar. Bebas cacat fisik (mata jernih, telinga utuh, kaki kokoh). Perawatan kandang higienis Boyolali.',
                'status' => 'available',
                'image' => '/images/sapi-simental.jpg',
            ],
            [
                'seller_id' => $seller1->id,
                'category_id' => $catSapi->id,
                'title' => 'Sapi Peranakan Ongole (PO) Putih Sehat Kurban',
                'breed' => 'Peranakan Ongole (PO)',
                'gender' => 'male',
                'weight_kg' => 430.00,
                'age_months' => 25,
                'price' => 22800000,
                'stock' => 1,
                'health_status' => 'Bebas Penyakit Menular, Sertifikat Dokter Hewan',
                'description' => 'Sapi lokal ras PO putih dengan punuk kokoh dan gelambir lebar. Tahan cuaca tropis, daging padat, sudah cukup umur ganti gigi (poel) sesuai syariat Islam.',
                'status' => 'available',
                'image' => '/images/sapi-po.jpg',
            ],
            [
                'seller_id' => $seller2->id,
                'category_id' => $catKambing->id,
                'title' => 'Kambing Etawa Super Pejantan Kaligesing',
                'breed' => 'Etawa Kaligesing',
                'gender' => 'male',
                'weight_kg' => 72.00,
                'age_months' => 19,
                'price' => 6200000,
                'stock' => 2,
                'health_status' => 'Vaksin PMK Dosis 2, Cek Darah Rutin',
                'description' => 'Kambing Etawa grade super dengan postur tinggi gagah, telinga melipat ke depan 32 cm, bulu lebat bersih. Ideal untuk bibit pejantan unggul maupun kurban istimewa.',
                'status' => 'available',
                'image' => '/images/kambing-etawa.jpg',
            ],
            [
                'seller_id' => $seller2->id,
                'category_id' => $catKambing->id,
                'title' => 'Kambing Jawa Randu Siap Aqiqah & Qurban',
                'breed' => 'Jawa Randu',
                'gender' => 'male',
                'weight_kg' => 38.00,
                'age_months' => 14,
                'price' => 2850000,
                'stock' => 4,
                'health_status' => 'Kondisi Prima, Bebas Cacing & Jamur',
                'description' => 'Kambing sehat lincah, tanduk utuh, ekor normal, memenuhi syarat sah syariat aqiqah dan kurban. Tersedia layanan titip potong atau diantar hidup ke alamat.',
                'status' => 'available',
                'image' => '/images/kambing-jawa-randu.jpg',
            ],
            [
                'seller_id' => $seller3->id,
                'category_id' => $catDomba->id,
                'title' => 'Domba Garut Tanduk Gayor Simetris Istimewa',
                'breed' => 'Garut Priangan',
                'gender' => 'male',
                'weight_kg' => 66.00,
                'age_months' => 22,
                'price' => 7500000,
                'stock' => 1,
                'health_status' => 'SKKH Terlampir, Bebas PMK, Mandi Teratur',
                'description' => 'Domba Garut jantan asli Priangan dengan tanduk muter kokoh melingkar indah. Dada bidang berotot, bulu putih bersih dicuci berkala, makan rumput hijau gunung Garut.',
                'status' => 'available',
                'image' => '/images/domba-garut.jpg',
            ],
            [
                'seller_id' => $seller3->id,
                'category_id' => $catDomba->id,
                'title' => 'Domba Texel Pedaging Gemuk Siap Potong',
                'breed' => 'Texel',
                'gender' => 'male',
                'weight_kg' => 54.00,
                'age_months' => 15,
                'price' => 4200000,
                'stock' => 3,
                'health_status' => 'Sehat Bebas Cacat, Vaksinasi Lengkap',
                'description' => 'Domba jenis Texel dengan persentase karkas daging tinggi hingga 52%. Punggung lebar padat, tulang kecil, sangat disukai juragan sate dan katering aqiqah.',
                'status' => 'available',
                'image' => '/images/domba-texel.jpg',
            ],
            [
                'seller_id' => $seller1->id,
                'category_id' => $catKerbau->id,
                'title' => 'Kerbau Murrah Jantan Perkasa Bobot 640kg',
                'breed' => 'Kerbau Murrah',
                'gender' => 'male',
                'weight_kg' => 640.00,
                'age_months' => 36,
                'price' => 33000000,
                'stock' => 1,
                'health_status' => 'Bersertifikat Veteriner Dinas Pertanian & Peternakan',
                'description' => 'Kerbau ras Murrah jantan sehat bugar dengan tanduk melengkung khas dan kulit legam bersih. Bobot riil ditimbang hidup, bebas penyakit mulut & kuku.',
                'status' => 'available',
                'image' => '/images/kerbau-murrah.jpg',
            ],
        ];

        foreach ($livestockData as $item) {
            $imagePath = $item['image'];
            unset($item['image']);

            $livestock = Livestock::firstOrCreate(
                ['title' => $item['title']],
                $item
            );

            $baseName = pathinfo($imagePath, PATHINFO_FILENAME);
            $multiImages = [$imagePath];
            if (file_exists(public_path("images/{$baseName}-detail.jpg"))) {
                $multiImages[] = "/images/{$baseName}-detail.jpg";
            } elseif (file_exists(public_path("images/{$baseName}-head.jpg"))) {
                $multiImages[] = "/images/{$baseName}-head.jpg";
            }
            if (file_exists(public_path("images/{$baseName}-posture.jpg"))) {
                $multiImages[] = "/images/{$baseName}-posture.jpg";
            } elseif (file_exists(public_path("images/{$baseName}-body.jpg"))) {
                $multiImages[] = "/images/{$baseName}-body.jpg";
            }

            foreach ($multiImages as $index => $imgUrl) {
                LivestockImage::firstOrCreate(
                    ['livestock_id' => $livestock->id, 'image_url' => $imgUrl],
                    ['is_primary' => $index === 0]
                );
            }
        }
    }
}
