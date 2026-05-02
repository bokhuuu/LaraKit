<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserRepository
{
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
            ->paginate(10);
    }

    public function findById(int $id)
    {
        return User::with('roles')->findOrFail($id);
    }

    public function findTrashedById(int $id): User
    {
        return User::onlyTrashed()->with('roles')->findOrFail($id);
    }

    public function getAllRoles()
    {
        return Role::all();
    }

    public function store(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->assignRole($data['role']);

        if (isset($data['avatar']) && $data['avatar'] instanceof \Illuminate\Http\UploadedFile) {
            $user->addMedia($data['avatar'])
                ->toMediaCollection('avatar');
        }

        return $user;
    }

    public function update(User $user, array $data)
    {
        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_active' => $data['is_active'],
        ]);

        if (!empty($data['password'])) {
            $user->update(['password' => Hash::make($data['password'])]);
        }

        $user->syncRoles($data['role']);

        if (!empty($data['remove_avatar'])) {
            $user->clearMediaCollection('avatar');
        }

        if (isset($data['avatar']) && $data['avatar'] instanceof \Illuminate\Http\UploadedFile) {
            $user->addMedia($data['avatar'])
                ->toMediaCollection('avatar');
        }

        return $user;
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function trashed(): LengthAwarePaginator
    {
        return User::onlyTrashed()->with('roles')->paginate(10);
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
