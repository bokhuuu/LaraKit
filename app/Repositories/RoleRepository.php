<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleRepository
{
    public function all(): Collection
    {
        return Role::with('permissions')->get();
    }

    public function syncPermissions(Role $role, array $permissions): void
    {
        $role->syncPermissions($permissions);
    }

    public function allPermissions(): Collection
    {
        return Permission::all();
    }
}
