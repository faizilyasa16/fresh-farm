<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\LivestockController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Marketplace Public Multi-Page Routes
Route::get('/', [MarketplaceController::class, 'home'])->name('marketplace.home');
Route::get('/katalog', [MarketplaceController::class, 'catalog'])->name('marketplace.catalog');
Route::get('/livestock/{id}', [MarketplaceController::class, 'show'])->name('marketplace.show');

// About Pages
Route::prefix('tentang')->name('about.')->group(function () {
    Route::get('/kami', [AboutController::class, 'company'])->name('company');
    Route::get('/hubungi', [AboutController::class, 'contact'])->name('contact');
    Route::get('/lokasi', [AboutController::class, 'location'])->name('location');
    Route::get('/pengiriman', [AboutController::class, 'delivery'])->name('delivery');
    Route::get('/garansi', [AboutController::class, 'guarantee'])->name('guarantee');
});

// Order & Booking Checkout
Route::get('/checkout/{id}', [OrderController::class, 'checkout'])->name('orders.checkout');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

// Seller & Admin Inventory Management
Route::prefix('seller')->name('seller.')->group(function () {
    Route::get('/inventory', [LivestockController::class, 'index'])->name('inventory');
    Route::post('/livestock', [LivestockController::class, 'store'])->name('livestock.store');
    Route::put('/livestock/{id}', [LivestockController::class, 'update'])->name('livestock.update');
    Route::delete('/livestock/{id}', [LivestockController::class, 'destroy'])->name('livestock.destroy');
});
