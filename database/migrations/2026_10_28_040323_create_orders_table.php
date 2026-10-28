<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('total_amount', 14, 2);
            $table->text('shipping_address');
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->enum('order_status', [
                'pending_payment',
                'paid',
                'processing',
                'shipped',
                'completed',
                'cancelled',
            ])->default('pending_payment');
            $table->string('payment_proof_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
