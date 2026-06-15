<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Handles HTTP requests for the users management module.
 *
 * Delegates all business logic to UserService.
 * This controller is responsible only for receiving requests,
 * passing data to the service and returning Inertia responses or redirects.
 */
class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'status']);

        return Inertia::render('admin/users/index', [
            'users' => $this->userService->index($filters),
            'filters' => $filters,
        ]);
    }

    /**
     * Renders the create user form with a role list filtered by the current user's permissions.
     *
     * Non-super-admins cannot see or assign admin or super admin roles.
     * This mirrors the protection rule enforced in UserService::store().
     */
    public function create(): Response
    {
        $roles = $this->userService->getAllRoles();

        if (! auth()->user()->hasRole(UserRole::SUPER_ADMIN)) {
            $roles = $roles->filter(
                fn($role) => $role->name !== UserRole::SUPER_ADMIN->value &&
                    $role->name !== UserRole::ADMIN->value
            )->values();
        }

        $roles = $roles->map(fn($role) => [
            'id' => $role->id,
            'name' => $role->name,
            'label' => UserRole::from($role->name)->label(),
        ])->values();

        return Inertia::render('admin/users/create', [
            'roles' => $roles,
        ]);
    }

    public function trashed(): Response
    {
        $trashedUsers = $this->userService->trashed();

        return Inertia::render('admin/users/trashed', [
            'users' => $trashedUsers,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        try {
            $this->userService->store($data);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Renders the edit form with the user's current data and permitted role options.
     *
     * Role list is filtered by the same rules as the create form.
     */
    public function edit(int $user): Response
    {
        $foundUser = $this->userService->findById($user);
        $roles = $this->userService->getAllRoles();

        if (! auth()->user()->hasRole(UserRole::SUPER_ADMIN)) {
            $roles = $roles->filter(
                fn($role) => $role->name !== UserRole::SUPER_ADMIN->value &&
                    $role->name !== UserRole::ADMIN->value
            )->values();
        }

        $roles = $roles->map(fn($role) => [
            'id' => $role->id,
            'name' => $role->name,
            'label' => UserRole::from($role->name)->label(),
        ])->values();

        return Inertia::render('admin/users/edit', [
            'user' => array_merge($foundUser->toArray(), [
                'last_login_at' => $foundUser->last_login_at?->format('M d, Y H:i'),
            ]),
            'roles' => $roles,
            'avatarUrl' => $foundUser->getFirstMediaUrl(config('larakit.media.avatar_collection'), 'thumb'),
        ]);
    }

    public function update(UpdateUserRequest $request, int $user): RedirectResponse
    {
        $data = $request->validated();
        $foundUser = $this->userService->findById($user);

        try {
            $this->userService->update($foundUser, $data);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(int $user): RedirectResponse
    {
        $foundUser = $this->userService->findById($user);

        try {
            $this->userService->delete($foundUser);
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function restore(int $user): RedirectResponse
    {
        $foundUser = $this->userService->findTrashedById($user);

        try {
            $this->userService->restore($foundUser);
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User was restored successfully.');
    }

    public function forceDelete(int $user): RedirectResponse
    {
        $foundUser = $this->userService->findTrashedById($user);

        try {
            $this->userService->forceDelete($foundUser);
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User was force deleted successfully.');
    }
}
