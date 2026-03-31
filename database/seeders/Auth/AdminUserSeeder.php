<?php

namespace Database\Seeders\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUser = User::firstOrCreate(
            ['email' => 'zura.coding@gmail.com'],
            [
                'name' => 'zura',
                'password' => Hash::make('zura123')
            ]
        );

        $adminUser->assignRole(UserRole::ADMIN->value);
    }
}
