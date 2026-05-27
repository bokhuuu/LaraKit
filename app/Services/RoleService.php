<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\RoleRepository;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Role;

/**
 * Handles business logic for role and permission management.
 *
 * Intentionally thin - role operations don't require complex protection rules.
 * Delegates directly to RoleRepository while keeping the controller
 * decoupled from the data layer.
 */
class RoleService
{
    public function __construct(protected RoleRepository $roleRepository) {}

    public function getAll(): Collection
    {
        return $this->roleRepository->all();
    }

    public function syncPermissions(Role $role, array $permissions): void
    {
        $this->roleRepository->syncPermissions($role, $permissions);
    }

    public function getAllPermissions(): Collection
    {
        return $this->roleRepository->allPermissions();
    }
}
