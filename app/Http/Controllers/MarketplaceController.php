<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Livestock;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    /**
     * Home / Landing Page.
     */
    public function home(Request $request): Response|JsonResponse
    {
        $featuredLivestocks = Livestock::with(['category', 'seller', 'images'])
            ->where('status', 'available')
            ->latest()
            ->take(8)
            ->get();

        $categories = Category::withCount(['livestocks' => function ($q) {
            $q->where('status', 'available');
        }])->get();

        $cities = User::where('role', 'seller')
            ->whereNotNull('city')
            ->pluck('city')
            ->unique()
            ->values();

        $stats = [
            'total_livestock' => Livestock::where('status', 'available')->count(),
            'total_sellers' => User::where('role', 'seller')->count(),
            'total_cities' => $cities->count(),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'featured' => $featuredLivestocks,
                'categories' => $categories,
            ]);
        }

        return Inertia::render('Home', [
            'featuredLivestocks' => $featuredLivestocks,
            'categories' => $categories,
            'cities' => $cities,
            'stats' => $stats,
        ]);
    }

    /**
     * Dedicated Catalog & Exploration Page.
     */
    public function catalog(Request $request): Response|JsonResponse
    {
        $query = Livestock::with(['category', 'seller', 'images'])
            ->where('status', 'available');

        // Filter Category
        if ($request->filled('category')) {
            $catSlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($catSlug) {
                $q->where('slug', $catSlug);
            });
        }

        // Filter Keyword Search
        if ($request->filled('q')) {
            $keyword = trim($request->input('q'));
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('breed', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%")
                    ->orWhereHas('seller', function ($sq) use ($keyword) {
                        $sq->where('name', 'like', "%{$keyword}%")
                            ->orWhere('city', 'like', "%{$keyword}%");
                    });
            });
        }

        // Filter Gender
        if ($request->filled('gender') && in_array($request->input('gender'), ['male', 'female'])) {
            $query->where('gender', $request->input('gender'));
        }

        // Filter City / Location
        if ($request->filled('city')) {
            $city = $request->input('city');
            $query->whereHas('seller', function ($q) use ($city) {
                $q->where('city', $city);
            });
        }

        // Filter Price Range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        // Filter Weight Range
        if ($request->filled('min_weight')) {
            $query->where('weight_kg', '>=', (float) $request->input('min_weight'));
        }
        if ($request->filled('max_weight')) {
            $query->where('weight_kg', '<=', (float) $request->input('max_weight'));
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'weight_desc' => $query->orderBy('weight_kg', 'desc'),
            default => $query->latest(),
        };

        $livestocks = $query->paginate(12)->withQueryString();

        $categories = Category::withCount(['livestocks' => function ($q) {
            $q->where('status', 'available');
        }])->get();

        $cities = User::where('role', 'seller')
            ->whereNotNull('city')
            ->pluck('city')
            ->unique()
            ->values();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $livestocks,
            ]);
        }

        return Inertia::render('Catalog', [
            'livestocks' => $livestocks,
            'categories' => $categories,
            'cities' => $cities,
            'filters' => [
                'category' => $request->input('category', ''),
                'q' => $request->input('q', ''),
                'city' => $request->input('city', ''),
                'gender' => $request->input('gender', ''),
                'min_price' => $request->input('min_price', ''),
                'max_price' => $request->input('max_price', ''),
                'min_weight' => $request->input('min_weight', ''),
                'max_weight' => $request->input('max_weight', ''),
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Dedicated Product Detail Page.
     */
    public function show(int $id): Response|JsonResponse
    {
        $livestock = Livestock::with(['category', 'seller', 'images'])->findOrFail($id);

        $related = Livestock::with(['category', 'seller', 'images'])
            ->where('category_id', $livestock->category_id)
            ->where('id', '!=', $livestock->id)
            ->where('status', 'available')
            ->take(4)
            ->get();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'livestock' => $livestock,
                'related' => $related,
            ]);
        }

        return Inertia::render('Detail', [
            'livestock' => $livestock,
            'related' => $related,
        ]);
    }
}
