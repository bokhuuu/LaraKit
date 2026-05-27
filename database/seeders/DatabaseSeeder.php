<?php

declare(strict_types=1);

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\Auth\AdminUserSeeder;
use Database\Seeders\Auth\PermissionSeeder;
use Database\Seeders\Auth\RoleSeeder;
use Database\Seeders\Settings\SettingSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            AdminUserSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
