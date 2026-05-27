<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRolePermissionsRequest;
use App\Services\RoleService;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(protected RoleService $roleService) {}

    public function index()
    {
        if (! auth()->user()->hasRole(UserRole::SUPER_ADMIN)) {
            abort(403);
        }

        return Inertia::render('admin/roles/index', [
            'allRoles' => $this->roleService->getAll(),
            'allPermissions' => $this->roleService->getAllPermissions(),
        ]);
    }

    public function update(UpdateRolePermissionsRequest $request, Role $role)
    {
        if (! auth()->user()->hasRole(UserRole::SUPER_ADMIN)) {
            abort(403);
        }

        $permissions = $request->validated();
        $this->roleService->syncPermissions($role, $permissions);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }
}
