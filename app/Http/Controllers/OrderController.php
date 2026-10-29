<?php

namespace App\Http\Controllers;

use App\Models\Livestock;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Dedicated Checkout / Order Page.
     */
    public function checkout(int $id): Response
    {
        $livestock = Livestock::with(['seller', 'category', 'images'])->findOrFail($id);

        return Inertia::render('Checkout', [
            'livestock' => $livestock,
        ]);
    }

    /**
     * Store order / checkout request.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'livestock_id' => ['required', 'exists:livestocks,id'],
            'buyer_name' => ['required', 'string', 'max:255'],
            'buyer_phone' => ['required', 'string', 'max:25'],
            'shipping_address' => ['required', 'string'],
            'delivery_method' => ['required', 'in:pickup,courier'],
            'notes' => ['nullable', 'string'],
            'payment_proof' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $livestock = Livestock::with(['seller', 'category'])->findOrFail($validated['livestock_id']);

        if ($livestock->status !== 'available') {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Maaf, ternak ini sudah tidak tersedia atau sedang dipesan orang lain.',
                ], 422);
            }

            return redirect()->back()->with('error', 'Maaf, ternak ini sudah dipesan orang lain.');
        }

        $authenticatedUser = $request->user();
        if ($authenticatedUser) {
            $buyer = $authenticatedUser;
            $buyer->update([
                'phone_number' => $buyer->phone_number ?: $validated['buyer_phone'],
                'address' => $buyer->address ?: $validated['shipping_address'],
            ]);
        } else {
            $buyer = User::firstOrCreate(
                ['phone_number' => $validated['buyer_phone']],
                [
                    'name' => $validated['buyer_name'],
                    'email' => 'buyer_'.time().'_'.mt_rand(100, 999).'@freshfarm.local',
                    'password' => bcrypt('password123'),
                    'role' => 'buyer',
                    'address' => $validated['shipping_address'],
                ]
            );
        }

        $shippingCost = 0;
        if ($validated['delivery_method'] === 'courier') {
            $isBigAnimal = in_array($livestock->category->slug, ['sapi', 'kerbau'], true);
            $shippingCost = $isBigAnimal ? 650000 : 350000;
        }

        $totalAmount = $livestock->price + $shippingCost;

        $paymentProofUrl = null;
        if ($request->hasFile('payment_proof')) {
            $storedPath = $request->file('payment_proof')->store('payment-proofs', 'public');
            $paymentProofUrl = '/storage/'.$storedPath;
        }

        $order = DB::transaction(function () use ($buyer, $livestock, $totalAmount, $validated, $shippingCost, $paymentProofUrl): Order {
            $lockedLivestock = Livestock::whereKey($livestock->id)->lockForUpdate()->firstOrFail();

            if ($lockedLivestock->status !== 'available') {
                abort(422, 'Ternak baru saja dipesan oleh pembeli lain.');
            }

            $newOrder = Order::create([
                'buyer_id' => $buyer->id,
                'seller_id' => $lockedLivestock->seller_id,
                'total_amount' => $totalAmount,
                'shipping_address' => $validated['shipping_address'],
                'shipping_cost' => $shippingCost,
                'order_status' => 'pending_payment',
                'payment_proof_url' => $paymentProofUrl,
            ]);

            OrderItem::create([
                'order_id' => $newOrder->id,
                'livestock_id' => $lockedLivestock->id,
                'quantity' => 1,
                'price_at_purchase' => $lockedLivestock->price,
            ]);

            $lockedLivestock->update([
                'status' => 'booked',
            ]);

            return $newOrder;
        });

        $sellerPhone = preg_replace('/[^0-9]/', '', $livestock->seller->phone_number ?? '6281234567890');
        if (str_starts_with($sellerPhone, '0')) {
            $sellerPhone = '62'.substr($sellerPhone, 1);
        }

        $waText = urlencode("Halo Peternak {$livestock->seller->name},\n\nSaya telah membuat pesanan #{$order->id} di Fresh Farm:\n- Hewan: {$livestock->title}\n- Bobot: {$livestock->weight_kg} kg\n- Harga Hewan: {$livestock->formatted_price}\n- Pengiriman: ".($validated['delivery_method'] === 'courier' ? 'Diantar Armada Ternak (Rp '.number_format($shippingCost, 0, ',', '.').')' : 'Ambil di Kandang (Rp 0)')."\n- Total Tagihan: Rp ".number_format($totalAmount, 0, ',', '.')."\n- Alamat: {$validated['shipping_address']}\n\nMohon konfirmasi ketersediaan dan rekening pembayaran. Terima kasih.");

        $waUrl = "https://wa.me/{$sellerPhone}?text={$waText}";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat. Hewan ternak telah di-booking untuk Anda.',
                'order' => $order,
                'whatsapp_url' => $waUrl,
            ]);
        }

        $redirectRoute = $authenticatedUser
            ? redirect()->route('dashboard', ['tab' => 'orders'])
            : redirect()->route('marketplace.show', $livestock->id);

        return $redirectRoute->with('order_success', [
            'order_id' => $order->id,
            'whatsapp_url' => $waUrl,
            'livestock_title' => $livestock->title,
            'total_amount' => $totalAmount,
        ]);
    }
}
