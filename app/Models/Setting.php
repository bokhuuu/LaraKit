<?php

namespace App\Models;

use App\Enums\Settings\SettingGroup;
use App\Enums\Settings\SettingType;
use App\Traits\ClearsInertiaCache;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Setting extends Model implements HasMedia
{
    use ClearsInertiaCache, InteractsWithMedia;

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

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('site_logo')->singleFile();
        $this->addMediaCollection('site_favicon')->singleFile();
        $this->addMediaCollection('og_image')->singleFile();
    }
}
