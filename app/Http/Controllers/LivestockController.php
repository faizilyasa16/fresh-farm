<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Livestock;
use App\Models\LivestockImage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LivestockController extends Controller
{
    /**
     * Display seller/admin livestock inventory or redirect to unified dashboard.
     */
    public function index(Request $request): RedirectResponse|JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->isBuyer()) {
            abort(403, 'Hanya peternak atau admin yang dapat mengelola inventaris ternak.');
        }

        if ($request->wantsJson() || $request->ajax()) {
            $query = Livestock::withTrashed()->with(['category', 'seller', 'images']);

            if ($user->isSeller()) {
                $query->where('seller_id', $user->id);
            }

            if ($request->filled('status') && $request->input('status') !== 'all') {
                $query->where('status', $request->input('status'));
            }

            return response()->json([
                'success' => true,
                'data' => $query->latest()->paginate(15)->withQueryString(),
            ]);
        }

        return redirect()->route('dashboard', ['tab' => 'livestocks']);
    }

    /**
     * Store a newly created livestock in storage.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->isBuyer()) {
            abort(403, 'Hanya peternak atau admin yang dapat menambahkan data ternak.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'seller_id' => ['nullable', 'exists:users,id'],
            'breed' => ['required', 'string', 'max:100'],
            'gender' => ['required', 'in:male,female'],
            'weight_kg' => ['required', 'numeric', 'min:1'],
            'age_months' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:100000'],
            'stock' => ['required', 'integer', 'min:1'],
            'health_status' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $sellerId = $user->isSeller()
            ? $user->id
            : ($validated['seller_id'] ?? User::where('role', 'seller')->value('id') ?? $user->id);

        $livestock = Livestock::create([
            'seller_id' => $sellerId,
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'breed' => $validated['breed'],
            'gender' => $validated['gender'],
            'weight_kg' => $validated['weight_kg'],
            'age_months' => $validated['age_months'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'health_status' => $validated['health_status'],
            'description' => $validated['description'] ?? null,
            'status' => 'available',
        ]);

        $imagePath = null;
        if ($request->hasFile('photo')) {
            $storedPath = $request->file('photo')->store('livestocks', 'public');
            $imagePath = '/storage/'.$storedPath;
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        } else {
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

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Data ternak berhasil ditambahkan ke katalog.',
                'data' => $livestock->load(['category', 'seller', 'images']),
            ]);
        }

        return redirect()->back()->with('success', 'Data hewan ternak baru berhasil ditambahkan ke katalog.');
    }

    /**
     * Update the specified livestock in storage.
     */
    public function update(Request $request, int $id): RedirectResponse|JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->isBuyer()) {
            abort(403, 'Hanya peternak atau admin yang dapat mengubah data ternak.');
        }

        $livestock = Livestock::withTrashed()->findOrFail($id);

        if ($user->isSeller() && $livestock->seller_id !== $user->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'breed' => ['sometimes', 'required', 'string', 'max:100'],
            'gender' => ['sometimes', 'required', 'in:male,female'],
            'weight_kg' => ['sometimes', 'required', 'numeric', 'min:1'],
            'age_months' => ['sometimes', 'required', 'integer', 'min:1'],
            'price' => ['sometimes', 'required', 'numeric', 'min:100000'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'health_status' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'in:available,booked,sold,archived'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $attributes = collect($validated)->except(['photo', 'image_url'])->all();

        if ($livestock->trashed() && isset($attributes['status']) && $attributes['status'] !== 'archived') {
            $livestock->restore();
        }

        $livestock->update($attributes);

        $newImagePath = null;
        if ($request->hasFile('photo')) {
            $storedPath = $request->file('photo')->store('livestocks', 'public');
            $newImagePath = '/storage/'.$storedPath;
        } elseif (! empty($validated['image_url'])) {
            $newImagePath = $validated['image_url'];
        }

        if ($newImagePath !== null) {
            $primaryImage = $livestock->images()->where('is_primary', true)->first() ?? $livestock->images()->first();
            if ($primaryImage) {
                if (str_starts_with($primaryImage->image_url, '/storage/livestocks/')) {
                    Storage::disk('public')->delete(Str::after($primaryImage->image_url, '/storage/'));
                }
                $primaryImage->update([
                    'image_url' => $newImagePath,
                    'is_primary' => true,
                ]);
            } else {
                LivestockImage::create([
                    'livestock_id' => $livestock->id,
                    'image_url' => $newImagePath,
                    'is_primary' => true,
                ]);
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Data ternak berhasil diperbarui.',
                'data' => $livestock->fresh(['category', 'seller', 'images']),
            ]);
        }

        return redirect()->back()->with('success', 'Data hewan ternak berhasil diperbarui.');
    }

    /**
     * Remove the specified livestock from storage (Soft Delete).
     */
    public function destroy(Request $request, int $id): RedirectResponse|JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->isBuyer()) {
            abort(403, 'Hanya peternak atau admin yang dapat mengarsipkan data ternak.');
        }

        $livestock = Livestock::findOrFail($id);

        if ($user->isSeller() && $livestock->seller_id !== $user->id) {
            abort(404);
        }

        $livestock->status = 'archived';
        $livestock->save();
        $livestock->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Data ternak berhasil diarsipkan (soft delete).',
            ]);
        }

        return redirect()->back()->with('success', 'Data ternak berhasil diarsipkan dari katalog utama.');
    }
}
