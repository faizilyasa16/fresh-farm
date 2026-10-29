<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LivestockController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Public Marketplace Routes
Route::get('/', [MarketplaceController::class, 'home'])->name('marketplace.home');
Route::get('/katalog', [MarketplaceController::class, 'catalog'])->name('marketplace.catalog');
Route::get('/livestock/{id}', [MarketplaceController::class, 'show'])->name('marketplace.show');

// About Pages
Route::prefix('tentang')->name('about.')->group(function (): void {
    Route::get('/kami', [AboutController::class, 'company'])->name('company');
    Route::get('/hubungi', [AboutController::class, 'contact'])->name('contact');
    Route::get('/lokasi', [AboutController::class, 'location'])->name('location');
    Route::get('/pengiriman', [AboutController::class, 'delivery'])->name('delivery');
    Route::get('/garansi', [AboutController::class, 'guarantee'])->name('guarantee');
});

// Guest Authentication Routes
Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login')->name('login.store');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Order & Booking Checkout (Accessible to Buyer & Guest)
Route::get('/checkout/{id}', [OrderController::class, 'checkout'])->name('orders.checkout');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

// Role-Based Dashboard (Admin, Seller, Buyer)
Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::put('/dashboard/profile', [DashboardController::class, 'updateProfile'])->name('dashboard.profile.update');
    Route::patch('/dashboard/orders/{order}/status', [DashboardController::class, 'updateOrderStatus'])->name('dashboard.orders.status');
    Route::post('/dashboard/orders/{order}/payment-proof', [DashboardController::class, 'uploadPaymentProof'])->name('dashboard.orders.payment-proof');
    Route::patch('/dashboard/users/{user}/verify', [DashboardController::class, 'toggleUserVerification'])->name('dashboard.users.verify');
    Route::post('/dashboard/categories', [DashboardController::class, 'storeCategory'])->name('dashboard.categories.store');
    Route::match(['put', 'post'], '/dashboard/categories/{category}', [DashboardController::class, 'updateCategory'])->name('dashboard.categories.update');
    Route::delete('/dashboard/categories/{category}', [DashboardController::class, 'destroyCategory'])->name('dashboard.categories.destroy');

    // Seller & Admin Inventory CRUD
    Route::prefix('seller')->name('seller.')->group(function (): void {
        Route::get('/inventory', [LivestockController::class, 'index'])->name('inventory');
        Route::post('/livestock', [LivestockController::class, 'store'])->name('livestock.store');
        Route::put('/livestock/{id}', [LivestockController::class, 'update'])->name('livestock.update');
        Route::delete('/livestock/{id}', [LivestockController::class, 'destroy'])->name('livestock.destroy');
    });
});
