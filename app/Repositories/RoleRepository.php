<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Handles all database operations for roles and permissions.
 *
 * Intentionally thin - roles don't require complex queries.
 * Permission syncing delegates directly to Spatie's built-in method.
 */
class RoleRepository
{
    public function all(): Collection
    {
        return Role::with('permissions')->get();
    }

    /**
     * Replaces the role's current permissions with the given set.
     *
     * Uses Spatie's syncPermissions which detaches removed
     * permissions and attaches new ones in a single operation.
     */
    public function syncPermissions(Role $role, array $permissions): void
    {
        $role->syncPermissions($permissions);
    }

    public function allPermissions(): Collection
    {
        return Permission::all();
    }
}
