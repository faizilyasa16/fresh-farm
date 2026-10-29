<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Livestock;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->isBuyer()) {
            return $this->renderBuyerDashboard($request, $user);
        }

        return $this->renderSellerOrAdminDashboard($request, $user);
    }

    private function renderBuyerDashboard(Request $request, User $user): Response
    {
        $allowedTabs = ['orders', 'profile'];
        $requestedTab = $request->string('tab')->toString();
        $activeTab = in_array($requestedTab, $allowedTabs, true) ? $requestedTab : 'orders';

        $ordersQuery = Order::with([
            'seller:id,name,phone_number,city,address',
            'items.livestock' => function ($query): void {
                $query->withTrashed()->with(['category:id,name,slug', 'images']);
            },
        ])->where('buyer_id', $user->id);

        $orderStatus = $request->string('order_status')->toString();
        if ($orderStatus !== '' && $orderStatus !== 'all') {
            $ordersQuery->where('order_status', $orderStatus);
        }

        $orders = $ordersQuery->latest()->paginate(10, ['*'], 'order_page')->withQueryString();

        $summary = [
            'total_orders' => Order::where('buyer_id', $user->id)->count(),
            'pending_orders' => Order::where('buyer_id', $user->id)->where('order_status', 'pending_payment')->count(),
            'active_orders' => Order::where('buyer_id', $user->id)->whereIn('order_status', ['paid', 'processing', 'shipped'])->count(),
            'completed_orders' => Order::where('buyer_id', $user->id)->where('order_status', 'completed')->count(),
        ];

        return Inertia::render('Dashboard/Index', [
            'activeTab' => $activeTab,
            'summary' => $summary,
            'orders' => $orders,
            'livestocks' => null,
            'categories' => [],
            'sellers' => [],
            'managedUsers' => [],
            'filters' => [
                'status' => 'all',
                'order_status' => $orderStatus ?: 'all',
                'q' => '',
            ],
        ]);
    }

    private function renderSellerOrAdminDashboard(Request $request, User $user): Response
    {
        $isAdmin = $user->isAdmin();
        $allowedTabs = $isAdmin
            ? ['orders', 'livestocks', 'users', 'categories', 'profile']
            : ['livestocks', 'orders', 'profile'];

        $defaultTab = $isAdmin ? 'orders' : 'livestocks';
        $requestedTab = $request->string('tab')->toString();
        $activeTab = in_array($requestedTab, $allowedTabs, true) ? $requestedTab : $defaultTab;

        $livestocksQuery = Livestock::withTrashed()
            ->with([
                'category:id,name,slug',
                'seller:id,name,city,phone_number,email_verified_at',
                'images',
            ]);

        if (! $isAdmin) {
            $livestocksQuery->where('seller_id', $user->id);
        }

        $statusFilter = $request->string('status', 'all')->toString();
        if ($statusFilter !== '' && $statusFilter !== 'all') {
            $livestocksQuery->where('status', $statusFilter);
        }

        $keyword = trim($request->string('q')->toString());
        if ($keyword !== '') {
            $livestocksQuery->where(function ($query) use ($keyword): void {
                $query->where('title', 'like', "%{$keyword}%")
                    ->orWhere('breed', 'like', "%{$keyword}%");
            });
        }

        $livestocks = $livestocksQuery->latest()->paginate(10, ['*'], 'livestock_page')->withQueryString();

        $ordersQuery = Order::with([
            'buyer:id,name,email,phone_number,city',
            'seller:id,name,phone_number,city',
            'items.livestock' => function ($query): void {
                $query->withTrashed()->with(['category:id,name,slug', 'images']);
            },
        ]);

        if (! $isAdmin) {
            $ordersQuery->where('seller_id', $user->id);
        }

        $orderStatus = $request->string('order_status', 'all')->toString();
        if ($orderStatus !== '' && $orderStatus !== 'all') {
            $ordersQuery->where('order_status', $orderStatus);
        }

        $orders = $ordersQuery->latest()->paginate(10, ['*'], 'order_page')->withQueryString();

        $categories = Category::withCount([
            'livestocks' => function ($query): void {
                $query->whereNull('deleted_at');
            },
        ])->orderBy('name')->get();

        if ($isAdmin) {
            $summary = [
                'total_livestock' => Livestock::count(),
                'available_livestock' => Livestock::where('status', 'available')->count(),
                'pending_orders' => Order::where('order_status', 'pending_payment')->count(),
                'completed_orders' => Order::whereIn('order_status', ['paid', 'processing', 'shipped', 'completed'])->count(),
                'unverified_sellers' => User::where('role', 'seller')->whereNull('email_verified_at')->count(),
                'total_sellers' => User::where('role', 'seller')->count(),
                'total_buyers' => User::where('role', 'buyer')->count(),
            ];

            $sellers = User::where('role', 'seller')
                ->select('id', 'name', 'city', 'email_verified_at')
                ->orderBy('name')
                ->get();

            $managedUsers = User::whereIn('role', ['seller', 'buyer'])
                ->withCount(['livestocks', 'orders', 'sales'])
                ->latest()
                ->get()
                ->map(fn (User $account): array => [
                    'id' => $account->id,
                    'name' => $account->name,
                    'email' => $account->email,
                    'phone_number' => $account->phone_number,
                    'role' => $account->role,
                    'city' => $account->city,
                    'address' => $account->address,
                    'is_verified' => $account->isVerified(),
                    'livestocks_count' => $account->livestocks_count,
                    'orders_count' => $account->orders_count,
                    'sales_count' => $account->sales_count,
                    'created_at' => $account->created_at?->format('d M Y'),
                ]);
        } else {
            $summary = [
                'total_livestock' => Livestock::where('seller_id', $user->id)->count(),
                'available_livestock' => Livestock::where('seller_id', $user->id)->where('status', 'available')->count(),
                'booked_livestock' => Livestock::where('seller_id', $user->id)->where('status', 'booked')->count(),
                'sold_livestock' => Livestock::where('seller_id', $user->id)->where('status', 'sold')->count(),
                'pending_orders' => Order::where('seller_id', $user->id)->where('order_status', 'pending_payment')->count(),
                'total_orders' => Order::where('seller_id', $user->id)->count(),
            ];
            $sellers = [];
            $managedUsers = [];
        }

        return Inertia::render('Dashboard/Index', [
            'activeTab' => $activeTab,
            'summary' => $summary,
            'livestocks' => $livestocks,
            'orders' => $orders,
            'categories' => $categories,
            'sellers' => $sellers,
            'managedUsers' => $managedUsers,
            'filters' => [
                'status' => $statusFilter ?: 'all',
                'order_status' => $orderStatus ?: 'all',
                'q' => $keyword,
            ],
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:25'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:1000'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'phone_number.required' => 'Nomor WhatsApp wajib diisi.',
            'city.required' => 'Kota atau kabupaten wajib diisi.',
            'address.required' => 'Alamat lengkap wajib diisi.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $payload = [
            'name' => $validated['name'],
            'phone_number' => $validated['phone_number'],
            'city' => $validated['city'],
            'address' => $validated['address'],
        ];

        if (! empty($validated['password'])) {
            $payload['password'] = $validated['password'];
        }

        $user->update($payload);

        return back()->with('success', 'Profil akun berhasil diperbarui.');
    }

    public function updateOrderStatus(Request $request, Order $order): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->isBuyer()) {
            if ($order->buyer_id !== $user->id) {
                abort(404);
            }

            if ($order->order_status !== 'pending_payment' || $request->input('order_status') !== 'cancelled') {
                abort(403, 'Pembeli hanya dapat membatalkan pesanan yang masih menunggu pembayaran.');
            }
        } elseif ($user->isSeller()) {
            if ($order->seller_id !== $user->id) {
                abort(404);
            }
        } elseif (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'order_status' => [
                'required',
                Rule::in(['pending_payment', 'paid', 'processing', 'shipped', 'completed', 'cancelled']),
            ],
        ]);

        $newStatus = $validated['order_status'];

        DB::transaction(function () use ($order, $newStatus): void {
            $order->update(['order_status' => $newStatus]);

            $order->loadMissing('items');
            $livestockIds = $order->items->pluck('livestock_id')->all();

            if ($livestockIds === []) {
                return;
            }

            if (in_array($newStatus, ['paid', 'processing', 'shipped', 'completed'], true)) {
                Livestock::whereIn('id', $livestockIds)->update(['status' => 'sold']);
            } elseif ($newStatus === 'cancelled') {
                Livestock::whereIn('id', $livestockIds)->update(['status' => 'available']);
            } elseif ($newStatus === 'pending_payment') {
                Livestock::whereIn('id', $livestockIds)->update(['status' => 'booked']);
            }
        });

        return back()->with('success', 'Status pesanan #'.$order->id.' berhasil diperbarui.');
    }

    public function uploadPaymentProof(Request $request, Order $order): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $user->isAdmin() && $order->buyer_id !== $user->id) {
            abort(404);
        }

        $request->validate([
            'payment_proof' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ], [
            'payment_proof.required' => 'Pilih file foto bukti transfer terlebih dahulu.',
            'payment_proof.image' => 'Bukti pembayaran harus berupa file gambar.',
            'payment_proof.mimes' => 'Format bukti pembayaran harus JPG, PNG, atau WebP.',
            'payment_proof.max' => 'Ukuran file bukti pembayaran maksimal 4 MB.',
        ]);

        if ($order->payment_proof_url && str_starts_with($order->payment_proof_url, '/storage/')) {
            $previousPath = Str::after($order->payment_proof_url, '/storage/');
            Storage::disk('public')->delete($previousPath);
        }

        $storedPath = $request->file('payment_proof')->store('payment-proofs', 'public');

        $order->update([
            'payment_proof_url' => '/storage/'.$storedPath,
        ]);

        return back()->with('success', 'Bukti transfer pesanan #'.$order->id.' berhasil diunggah dan menunggu verifikasi.');
    }

    public function toggleUserVerification(Request $request, User $user): RedirectResponse
    {
        if (! $request->user()?->isAdmin()) {
            abort(403);
        }

        if ($user->isAdmin()) {
            return back()->with('error', 'Status akun admin utama tidak dapat diubah.');
        }

        $nextVerifiedState = $user->isVerified() ? null : now();
        $user->forceFill(['email_verified_at' => $nextVerifiedState])->save();

        $statusLabel = $nextVerifiedState ? 'terverifikasi' : 'belum terverifikasi';

        return back()->with('success', "Status akun {$user->name} diubah menjadi {$statusLabel}.");
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        if (! $request->user()?->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')],
            'icon_url' => ['nullable', 'string', 'max:100'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:5120'],
        ], [
            'name.required' => 'Nama kategori hewan wajib diisi.',
            'name.unique' => 'Kategori dengan nama tersebut sudah terdaftar.',
            'image.image' => 'File foto kategori harus berupa gambar (jpg, png, webp).',
            'image.max' => 'Ukuran foto kategori maksimal 5MB.',
        ]);

        $imageUrl = $validated['image_url'] ?? null;
        if ($request->hasFile('image')) {
            $storedPath = $request->file('image')->store('categories', 'public');
            $imageUrl = Storage::url($storedPath);
        }

        $slug = Str::slug($validated['name']);
        if (Category::where('slug', $slug)->exists()) {
            $slug .= '-'.Str::lower(Str::random(4));
        }

        Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'icon_url' => $validated['icon_url'] ?: $slug,
            'image_url' => $imageUrl,
        ]);

        return back()->with('success', 'Kategori hewan baru berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, Category $category): RedirectResponse
    {
        if (! $request->user()?->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($category->id)],
            'icon_url' => ['nullable', 'string', 'max:100'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:5120'],
        ], [
            'name.required' => 'Nama kategori hewan wajib diisi.',
            'name.unique' => 'Kategori dengan nama tersebut sudah terdaftar.',
            'image.image' => 'File foto kategori harus berupa gambar (jpg, png, webp).',
            'image.max' => 'Ukuran foto kategori maksimal 5MB.',
        ]);

        $imageUrl = $category->image_url;
        if ($request->hasFile('image')) {
            $storedPath = $request->file('image')->store('categories', 'public');
            $imageUrl = Storage::url($storedPath);
        } elseif (array_key_exists('image_url', $validated)) {
            $imageUrl = $validated['image_url'];
        }

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon_url' => $validated['icon_url'] ?: $category->icon_url,
            'image_url' => $imageUrl,
        ]);

        return back()->with('success', 'Master kategori berhasil diperbarui.');
    }

    public function destroyCategory(Request $request, Category $category): RedirectResponse
    {
        if (! $request->user()?->isAdmin()) {
            abort(403);
        }

        if ($category->livestocks()->withTrashed()->exists()) {
            return back()->with('error', 'Kategori tidak dapat dihapus karena masih memiliki data hewan ternak.');
        }

        $category->delete();

        return back()->with('success', 'Kategori hewan berhasil dihapus.');
    }
}
