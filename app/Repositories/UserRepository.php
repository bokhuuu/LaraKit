<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

/**
 * Handles all database operations for the User model.
 *
 * This is the only place in the app that directly queries users.
 * Business logic and protection rules live in UserService.
 */
class UserRepository
{
    /**
     * Returns a paginated list of users with optional search, role and status filters.
     *
     * Uses Laravel's when() to conditionally apply each filter,
     * keeping the query clean without nested if statements.
     */
    public function index(array $filters = []): LengthAwarePaginator
    {
        return User::with(['roles', 'media'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, function ($query, $role) {
                $query->whereHas('roles', fn($q) => $q->where('name', $role));
            })
            ->when(isset($filters['status']), function ($query) use ($filters) {
                $query->where('is_active', $filters['status'] === 'active');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(config('larakit.pagination'));
    }

    /**
     * Finds a user by ID with their roles eagerly loaded, or throws a 404.
     */
    public function findById(int $id)
    {
        return User::with('roles')->findOrFail($id);
    }

    /**
     * Finds a soft-deleted user by ID, or throws a 404.
     */
    public function findTrashedById(int $id): User
    {
        return User::onlyTrashed()->with('roles')->findOrFail($id);
    }

    /**
     * Returns all available roles for use in dropdowns and role assignment.
     */
    public function getAllRoles()
    {
        return Role::all();
    }

    /**
     * Creates a new user, assigns their role and handles avatar upload if provided.
     */
    public function store(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->assignRole($data['role']);

        if (isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            $user->addMedia($data['avatar'])
                ->toMediaCollection(config('larakit.media.avatar_collection'));
        }

        return $user;
    }

    /**
     * Updates user details, syncs their role and manages avatar changes.
     *
     * Password is only updated if a new one is provided.
     * Avatar is cleared first if remove_avatar is set, then replaced if a new file is uploaded.
     */
    public function update(User $user, array $data)
    {
        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_active' => $data['is_active'],
        ]);

        if (! empty($data['password'])) {
            $user->update(['password' => Hash::make($data['password'])]);
        }

        $user->syncRoles($data['role']);

        if (! empty($data['remove_avatar'])) {
            $user->clearMediaCollection(config('larakit.media.avatar_collection'));
        }

        if (isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            $user->addMedia($data['avatar'])
                ->toMediaCollection(config('larakit.media.avatar_collection'));
        }

        return $user;
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function trashed(): LengthAwarePaginator
    {
        return User::onlyTrashed()->with('roles')->paginate(config('larakit.pagination'));
    }

    public function restore(User $user): void
    {
        $user->restore();
    }

    public function forceDelete(User $user): void
    {
        $user->forceDelete();
    }
}
