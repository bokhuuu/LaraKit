<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Settings\SettingGroup;
use App\Enums\Settings\SettingType;
use App\Traits\ClearsInertiaCache;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * Represents a single configurable site setting.
 *
 * Settings are stored as key-value pairs and organised into groups
 * and types using Enums. File-based settings (logo, favicon, OG image)
 * are managed via Spatie Media Library. All value changes are tracked
 * in a dedicated settings activity log.
 */
class Setting extends Model implements HasMedia
{
    use ClearsInertiaCache, InteractsWithMedia, LogsActivity;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'label',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
        'type' => SettingType::class,
        'group' => SettingGroup::class,
    ];

    /**
     * Registers the media collections for file-based settings.
     *
     * Each collection is restricted to a single file, so uploading
     * a new logo automatically replaces the previous one.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('site_logo')->singleFile();
        $this->addMediaCollection('site_favicon')->singleFile();
        $this->addMediaCollection('og_image')->singleFile();
    }

    /**
     * Configures activity logging for settings.
     *
     * Only tracks changes to the value column and logs them
     * under the 'settings' channel to keep them separate
     * from user activity in the audit trail.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['value'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('settings');
    }
}
