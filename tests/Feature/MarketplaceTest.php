<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Livestock;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketplaceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_marketplace_homepage_loads_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('Fresh Farm');
        $response->assertSee('Limousin');
    }

    public function test_filter_by_category_returns_only_matching_livestock(): void
    {
        $response = $this->getJson('/katalog?category=sapi');

        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals('sapi', $item['category']['slug']);
        }
    }

    public function test_search_by_keyword_matches_breed_or_title(): void
    {
        $response = $this->getJson('/katalog?q=Garut');

        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertTrue(
                str_contains($item['title'], 'Garut') ||
                str_contains($item['breed'], 'Garut') ||
                str_contains($item['seller']['city'] ?? '', 'Garut') ||
                str_contains($item['seller']['name'] ?? '', 'Garut')
            );
        }
    }

    public function test_can_view_single_livestock_detail_json(): void
    {
        $livestock = Livestock::first();

        $response = $this->getJson("/livestock/{$livestock->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'livestock' => [
                'id' => $livestock->id,
                'title' => $livestock->title,
            ],
        ]);
    }

    public function test_can_view_checkout_page(): void
    {
        $livestock = Livestock::first();

        $response = $this->get("/checkout/{$livestock->id}");

        $response->assertStatus(200);
    }

    public function test_seller_can_view_inventory_dashboard(): void
    {
        $response = $this->get('/seller/inventory');

        $response->assertStatus(200);
    }

    public function test_buyer_can_create_order_and_books_livestock(): void
    {
        $livestock = Livestock::where('status', 'available')->first();

        $orderData = [
            'livestock_id' => $livestock->id,
            'buyer_name' => 'H. Mulyadi',
            'buyer_phone' => '081299887766',
            'shipping_address' => 'Jl. Kebon Jeruk No. 10, Jakarta Barat',
            'delivery_method' => 'courier',
            'notes' => 'Tolong mandikan sebelum dikirim',
        ];

        $response = $this->postJson('/orders', $orderData);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('orders', [
            'shipping_address' => 'Jl. Kebon Jeruk No. 10, Jakarta Barat',
            'order_status' => 'pending_payment',
        ]);

        $this->assertEquals('booked', $livestock->fresh()->status);
    }

    public function test_seller_can_create_new_livestock(): void
    {
        $category = Category::where('slug', 'kambing')->first();
        $seller = User::where('role', 'seller')->first();

        $data = [
            'seller_id' => $seller->id,
            'category_id' => $category->id,
            'title' => 'Kambing Boer Asli Pejantan Unggul',
            'breed' => 'Boer Afrika',
            'gender' => 'male',
            'weight_kg' => 58,
            'age_months' => 17,
            'price' => 5400000,
            'stock' => 1,
            'health_status' => 'Vaksin PMK Dosis 2 Lengkap',
            'description' => 'Kambing pedaging gemuk dan sehat.',
        ];

        $response = $this->postJson('/seller/livestock', $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('livestocks', [
            'title' => 'Kambing Boer Asli Pejantan Unggul',
            'breed' => 'Boer Afrika',
        ]);
    }

    public function test_seller_can_update_livestock_status(): void
    {
        $livestock = Livestock::first();

        $response = $this->putJson("/seller/livestock/{$livestock->id}", [
            'status' => 'sold',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('sold', $livestock->fresh()->status);
    }

    public function test_seller_can_soft_delete_livestock(): void
    {
        $livestock = Livestock::first();

        $response = $this->deleteJson("/seller/livestock/{$livestock->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('livestocks', [
            'id' => $livestock->id,
        ]);
    }
}
