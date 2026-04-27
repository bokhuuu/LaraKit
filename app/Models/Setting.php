<?php

namespace App\Models;

use App\Enums\Settings\SettingGroup;
use App\Enums\Settings\SettingType;
use App\Traits\ClearsInertiaCache;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use ClearsInertiaCache;

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
}
