<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Livestock;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuthAndDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guests_are_redirected_to_login_from_protected_routes(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
        $this->get('/seller/inventory')->assertRedirect('/login');
        $this->post('/seller/livestock', [])->assertRedirect('/login');
    }

    public function test_user_can_register_as_buyer_or_seller_but_cannot_self_assign_admin(): void
    {
        $buyerResponse = $this->post('/register', [
            'name' => 'Ahmad Panitia Kurban',
            'email' => 'ahmad@kurban.org',
            'phone_number' => '081234560001',
            'role' => 'buyer',
            'city' => 'Depok',
            'address' => 'Jl. Margonda Raya No. 12',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $buyerResponse->assertRedirect('/dashboard');
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'email' => 'ahmad@kurban.org',
            'role' => 'buyer',
        ]);

        $this->post('/logout');

        $invalidAdminResponse = $this->post('/register', [
            'name' => 'Escalation Attempt',
            'email' => 'hacker@example.com',
            'phone_number' => '081200009999',
            'role' => 'admin',
            'city' => 'Jakarta',
            'address' => 'Jl. Test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $invalidAdminResponse->assertSessionHasErrors('role');
        $this->assertDatabaseMissing('users', ['email' => 'hacker@example.com']);
    }

    public function test_user_can_login_view_role_dashboard_and_logout(): void
    {
        $seller = User::where('email', 'sukirman@berkahboyolali.com')->firstOrFail();

        $this->post('/login', [
            'email' => $seller->email,
            'password' => 'wrong-password',
        ])->assertSessionHasErrors('email');

        $this->post('/login', [
            'email' => $seller->email,
            'password' => 'password',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($seller);

        $this->get('/dashboard')->assertOk();

        $this->post('/logout')->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_seller_can_upload_livestock_photo_and_cannot_modify_other_sellers_livestock(): void
    {
        Storage::fake('public');

        $sellerA = User::where('email', 'sukirman@berkahboyolali.com')->firstOrFail();
        $sellerB = User::where('email', 'ridwan@aqiqahmandiri.id')->firstOrFail();
        $category = Category::where('slug', 'sapi')->firstOrFail();

        $response = $this->actingAs($sellerA)->post('/seller/livestock', [
            'category_id' => $category->id,
            'title' => 'Sapi Bali Pejantan Sehat',
            'breed' => 'Sapi Bali',
            'gender' => 'male',
            'weight_kg' => 420,
            'age_months' => 24,
            'price' => 24500000,
            'stock' => 2,
            'health_status' => 'Bebas PMK dan SKKH Lengkap',
            'description' => 'Pakan rumput gajah segar.',
            'photo' => UploadedFile::fake()->image('sapi-bali.jpg', 800, 600),
        ]);

        $response->assertRedirect();

        $created = Livestock::where('title', 'Sapi Bali Pejantan Sehat')->firstOrFail();
        $this->assertEquals($sellerA->id, $created->seller_id);

        $imageRecord = $created->images()->firstOrFail();
        $this->assertStringStartsWith('/storage/livestocks/', $imageRecord->image_url);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $imageRecord->image_url));

        // Seller B cannot edit or delete Seller A's livestock
        $this->actingAs($sellerB)
            ->put("/seller/livestock/{$created->id}", ['price' => 100000])
            ->assertNotFound();

        $this->actingAs($sellerB)
            ->delete("/seller/livestock/{$created->id}")
            ->assertNotFound();
    }

    public function test_buyer_cannot_manage_livestock_inventory(): void
    {
        $buyer = User::factory()->buyer()->create();
        $livestock = Livestock::firstOrFail();

        $this->actingAs($buyer)->get('/seller/inventory')->assertForbidden();
        $this->actingAs($buyer)->post('/seller/livestock', [])->assertForbidden();
        $this->actingAs($buyer)->delete("/seller/livestock/{$livestock->id}")->assertForbidden();
    }

    public function test_buyer_can_upload_payment_proof_and_seller_verifies_order_as_paid(): void
    {
        Storage::fake('public');

        $buyer = User::where('role', 'buyer')->firstOrFail();
        $livestock = Livestock::where('status', 'available')->firstOrFail();
        $seller = User::findOrFail($livestock->seller_id);

        $this->actingAs($buyer)->post('/orders', [
            'livestock_id' => $livestock->id,
            'buyer_name' => $buyer->name,
            'buyer_phone' => $buyer->phone_number,
            'shipping_address' => $buyer->address,
            'delivery_method' => 'pickup',
            'notes' => 'Ambil hari Sabtu pagi',
        ])->assertRedirect(route('dashboard', ['tab' => 'orders']));

        $order = Order::where('buyer_id', $buyer->id)->latest('id')->firstOrFail();
        $this->assertEquals('booked', $livestock->fresh()->status);

        // Buyer uploads payment transfer proof
        $this->actingAs($buyer)->post("/dashboard/orders/{$order->id}/payment-proof", [
            'payment_proof' => UploadedFile::fake()->image('bukti-transfer.jpg'),
        ])->assertRedirect();

        $order->refresh();
        $this->assertNotNull($order->payment_proof_url);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $order->payment_proof_url));

        // Buyer cannot mark own order as paid
        $this->actingAs($buyer)->patch("/dashboard/orders/{$order->id}/status", [
            'order_status' => 'paid',
        ])->assertForbidden();

        // Seller verifies payment -> livestock becomes sold
        $this->actingAs($seller)->patch("/dashboard/orders/{$order->id}/status", [
            'order_status' => 'paid',
        ])->assertRedirect();

        $this->assertEquals('paid', $order->fresh()->order_status);
        $this->assertEquals('sold', $livestock->fresh()->status);
    }

    public function test_buyer_cancelling_pending_order_restores_livestock_availability(): void
    {
        $buyer = User::factory()->buyer()->create();
        $livestock = Livestock::where('status', 'available')->firstOrFail();
        $livestock->update(['status' => 'booked']);

        $order = Order::create([
            'buyer_id' => $buyer->id,
            'seller_id' => $livestock->seller_id,
            'total_amount' => $livestock->price,
            'order_status' => 'pending_payment',
            'shipping_address' => 'Jl. Melati No. 5, Bekasi',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'livestock_id' => $livestock->id,
            'price_at_purchase' => $livestock->price,
            'quantity' => 1,
        ]);

        $this->actingAs($buyer)
            ->patch("/dashboard/orders/{$order->id}/status", ['order_status' => 'cancelled'])
            ->assertRedirect();

        $this->assertEquals('cancelled', $order->fresh()->order_status);
        $this->assertEquals('available', $livestock->fresh()->status);
    }

    public function test_admin_can_verify_seller_and_manage_master_categories(): void
    {
        $admin = User::where('role', 'admin')->firstOrFail();
        $unverifiedSeller = User::factory()->seller()->unverified()->create();

        $this->assertFalse($unverifiedSeller->isVerified());

        $this->actingAs($admin)
            ->patch("/dashboard/users/{$unverifiedSeller->id}/verify")
            ->assertRedirect();

        $this->assertTrue($unverifiedSeller->fresh()->isVerified());

        // Create, update, and delete an empty category
        $this->actingAs($admin)->post('/dashboard/categories', [
            'name' => 'Kambing Perah',
            'icon_url' => 'kambing',
        ])->assertRedirect();

        $category = Category::where('slug', 'kambing-perah')->firstOrFail();

        $this->actingAs($admin)->put("/dashboard/categories/{$category->id}", [
            'name' => 'Kambing Perah Unggul',
            'icon_url' => 'kambing',
        ])->assertRedirect();

        $this->assertEquals('Kambing Perah Unggul', $category->fresh()->name);

        $this->actingAs($admin)->delete("/dashboard/categories/{$category->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
