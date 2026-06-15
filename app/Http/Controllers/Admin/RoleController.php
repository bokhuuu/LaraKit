<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRolePermissionsRequest;
use App\Services\RoleService;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

/**
 * Handles HTTP requests for the roles and permissions manager.
 *
 * Restricted to super admin only - no other role can view
 * or modify permission assignments.
 */
class RoleController extends Controller
{
    public function __construct(protected RoleService $roleService) {}

    /**
     * Renders the permissions matrix with all roles and their assigned permissions.
     */
    public function index(): Response
    {
        if (! auth()->user()->hasRole(UserRole::SUPER_ADMIN)) {
            abort(403);
        }

        return Inertia::render('admin/roles/index', [
            'allRoles' => $this->roleService->getAll(),
            'allPermissions' => $this->roleService->getAllPermissions(),
        ]);
    }

    /**
     * Replaces the role's current permissions with the submitted set.
     *
     * Uses sync, so any permissions not included in the request are detached.
     */
    public function update(UpdateRolePermissionsRequest $request, Role $role): RedirectResponse
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
