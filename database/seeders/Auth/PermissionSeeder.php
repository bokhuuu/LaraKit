<?php

declare(strict_types=1);

namespace Database\Seeders\Auth;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (config('permissions') as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => $module.'.'.$action,
                    'guard_name' => 'web',
                ]);
            }
        }

        $superAdmin = Role::findByName('super_admin');
        $superAdmin->syncPermissions(Permission::all());

        $admin = Role::findByName('admin');
        $admin->syncPermissions(
            Permission::whereNotIn('name', ['roles.view', 'roles.edit'])->get()
        );

        $editor = Role::findByName('editor');
        $editor->syncPermissions([]);

        $viewer = Role::findByName('viewer');
        $viewer->syncPermissions([]);
    }
}
