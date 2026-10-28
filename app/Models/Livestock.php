<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Livestock extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'livestocks';

    protected $fillable = [
        'seller_id',
        'category_id',
        'title',
        'breed',
        'gender',
        'weight_kg',
        'age_months',
        'price',
        'stock',
        'health_status',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'float',
            'price' => 'float',
            'stock' => 'integer',
            'age_months' => 'integer',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(LivestockImage::class);
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(LivestockImage::class)->where('is_primary', true);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', 'available');
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'Rp '.number_format($this->price, 0, ',', '.');
    }

    public function getPrimaryImageUrlAttribute(): string
    {
        $primary = $this->images->firstWhere('is_primary', true) ?? $this->images->first();

        return $primary ? $primary->image_url : '/images/placeholder-animal.jpg';
    }
}
