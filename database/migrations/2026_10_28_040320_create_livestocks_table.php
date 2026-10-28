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
        Schema::create('livestocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('title');
            $table->string('breed');
            $table->enum('gender', ['male', 'female']);
            $table->decimal('weight_kg', 8, 2);
            $table->integer('age_months');
            $table->decimal('price', 14, 2);
            $table->integer('stock')->default(1);
            $table->string('health_status')->default('Sehat & Bebas PMK');
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'booked', 'sold', 'archived'])->default('available');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livestocks');
    }
};
