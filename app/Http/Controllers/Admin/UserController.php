<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Enums\UserRole;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'role', 'status']);

        return Inertia::render('admin/users/index', [
            'users' => $this->userService->index($filters),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $roles = $this->userService->getAllRoles();

        if (!auth()->user()->hasRole(UserRole::SUPER_ADMIN)) {
            $roles = $roles->filter(
                fn($role) =>
                $role->name !== UserRole::SUPER_ADMIN->value &&
                    $role->name !== UserRole::ADMIN->value
            )->values();
        }

        $roles = $roles->map(fn($role) => [
            'id'    => $role->id,
            'name'  => $role->name,
            'label' => UserRole::from($role->name)->label(),
        ])->values();

        return Inertia::render('admin/users/create', [
            'roles' => $roles
        ]);
    }

    public function trashed()
    {
        $trashedUsers = $this->userService->trashed();

        return Inertia::render('admin/users/trashed', [
            'users' => $trashedUsers
        ]);
    }

    public function store(StoreUserRequest $request)
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

    public function edit(int $user)
    {
        $foundUser = $this->userService->findById($user);
        $roles = $this->userService->getAllRoles();

        if (!auth()->user()->hasRole(UserRole::SUPER_ADMIN)) {
            $roles = $roles->filter(
                fn($role) =>
                $role->name !== UserRole::SUPER_ADMIN->value &&
                    $role->name !== UserRole::ADMIN->value
            )->values();
        }

        $roles = $roles->map(fn($role) => [
            'id'    => $role->id,
            'name'  => $role->name,
            'label' => UserRole::from($role->name)->label(),
        ])->values();

        return Inertia::render('admin/users/edit', [
            'user'  => $foundUser,
            'roles' => $roles,
        ]);
    }

    public function update(UpdateUserRequest $request, int $user)
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

    public function destroy(int $user)
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

    public function restore(int $user)
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

    public function forceDelete(int $user)
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
