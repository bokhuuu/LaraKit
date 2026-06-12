<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Modules\Posts\Models\Post;
use App\Traits\ClearsInertiaCache;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Traits\HasRoles;

/**
 * Represents an admin panel user.
 *
 * Combines authentication, role-based permissions, avatar management,
 * activity logging, soft deletes and two-factor authentication.
 * Acts as the central model that most other systems in LaraKit interact with.
 */
class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<UserFactory> */
    use ClearsInertiaCache,
        HasFactory,
        HasRoles,
        InteractsWithMedia,
        LogsActivity,
        Notifiable,
        SoftDeletes,
        TwoFactorAuthenticatable,
        HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'is_active',
        'last_login_at',
        'last_login_ip',
        'last_login_agent',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    protected $appends = ['avatar_url'];

    /**
     * Returns the URL of the user's avatar thumbnail.
     *
     * Falls back to an empty string if no avatar has been uploaded,
     * which the frontend handles by showing a default placeholder.
     */
    public function getAvatarUrlAttribute(): string
    {
        return $this->getFirstMediaUrl(config('larakit.media.avatar_collection'), 'thumb');
    }

    /**
     * Registers the avatar media collection.
     *
     * Restricted to a single file and accepts only common image formats.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }

    /**
     * Registers the thumbnail conversion applied to uploaded avatars.
     *
     * Generates a 100x100 crop synchronously (non-queued) so the
     * avatar is immediately available after upload.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(100)
            ->height(100)
            ->nonQueued();
    }

    /**
     * Configures which fields Spatie Activity Log tracks for this model.
     *
     * Only logs name, email and is_active - ignores password changes
     * and only records changes when a value actually differs.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'is_active'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /**
     * A user can author many posts.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }
}
