<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Livestock;
use App\Models\LivestockImage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LivestockController extends Controller
{
    /**
     * Display seller/admin livestock inventory dashboard.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $seller = User::where('role', 'seller')->first();

        $query = Livestock::withTrashed()->with(['category', 'seller', 'images']);

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $livestocks = $query->latest()->paginate(15)->withQueryString();
        $categories = Category::all();
        $sellers = User::where('role', 'seller')->get();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $livestocks,
            ]);
        }

        return Inertia::render('Seller/Inventory', [
            'livestocks' => $livestocks,
            'categories' => $categories,
            'sellers' => $sellers,
            'currentSeller' => $seller,
            'filterStatus' => $request->input('status', 'all'),
        ]);
    }

    /**
     * Store a newly created livestock in storage.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'seller_id' => 'nullable|exists:users,id',
            'breed' => 'required|string|max:100',
            'gender' => 'required|in:male,female',
            'weight_kg' => 'required|numeric|min:1',
            'age_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:100000',
            'stock' => 'required|integer|min:1',
            'health_status' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        // Default seller if not logged in
        if (empty($validated['seller_id'])) {
            $defaultSeller = User::where('role', 'seller')->first();
            $validated['seller_id'] = $defaultSeller ? $defaultSeller->id : 1;
        }

        $validated['status'] = 'available';

        $livestock = Livestock::create($validated);

        // Handle image
        $imagePath = $request->input('image_url');
        if (empty($imagePath)) {
            // Assign realistic image based on category
            $cat = Category::find($validated['category_id']);
            $imagePath = match ($cat?->slug) {
                'sapi' => '/images/sapi-limousin.jpg',
                'kambing' => '/images/kambing-etawa.jpg',
                'domba' => '/images/domba-garut.jpg',
                'kerbau' => '/images/kerbau-murrah.jpg',
                default => '/images/hero-farm.jpg',
            };
        }

        LivestockImage::create([
            'livestock_id' => $livestock->id,
            'image_url' => $imagePath,
            'is_primary' => true,
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Data ternak berhasil ditambahkan ke katalog!',
                'data' => $livestock->load(['category', 'seller', 'images']),
            ]);
        }

        return redirect()->back()->with('success', 'Data hewan ternak baru berhasil ditambahkan!');
    }

    /**
     * Update the specified livestock in storage.
     */
    public function update(Request $request, int $id): RedirectResponse|JsonResponse
    {
        $livestock = Livestock::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'breed' => 'sometimes|required|string|max:100',
            'gender' => 'sometimes|required|in:male,female',
            'weight_kg' => 'sometimes|required|numeric|min:1',
            'age_months' => 'sometimes|required|integer|min:1',
            'price' => 'sometimes|required|numeric|min:100000',
            'stock' => 'sometimes|required|integer|min:0',
            'health_status' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:available,booked,sold,archived',
            'description' => 'nullable|string',
        ]);

        $livestock->update($validated);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Data ternak berhasil diperbarui!',
                'data' => $livestock->fresh(['category', 'seller', 'images']),
            ]);
        }

        return redirect()->back()->with('success', 'Data hewan ternak berhasil diperbarui!');
    }

    /**
     * Remove the specified livestock from storage (Soft Delete).
     */
    public function destroy(Request $request, int $id): RedirectResponse|JsonResponse
    {
        $livestock = Livestock::findOrFail($id);
        $livestock->status = 'archived';
        $livestock->save();
        $livestock->delete(); // Soft delete

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Data ternak berhasil diarsipkan (soft delete).',
            ]);
        }

        return redirect()->back()->with('success', 'Data ternak berhasil dihapus dari katalog utama!');
    }
}
