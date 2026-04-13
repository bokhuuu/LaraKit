<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Enums\UserRole;

class UserService
{
    public function __construct(protected UserRepository $userRepository) {}

    public function index()
    {
        return $this->userRepository->index();
    }

    public function getAllRoles()
    {
        return $this->userRepository->getAllRoles();
    }

    public function store(array $data): User
    {
        if (
            in_array($data['role'], [UserRole::ADMIN->value, UserRole::SUPER_ADMIN->value])
            && !auth()->user()->hasRole(UserRole::SUPER_ADMIN)
        ) {
            throw new \RuntimeException("Only super admin can create admin accounts.");
        }
        return $this->userRepository->store($data);
    }

    public function findById(int $id): User
    {
        return $this->userRepository->findById($id);
    }

    public function update(User $user, array $data): User
    {
        if ($user->hasRole(UserRole::SUPER_ADMIN) && $user->id !== auth()->id()) {
            throw new \RuntimeException("Super admin account cannot be modified.");
        }

        if (auth()->user()->hasRole(UserRole::ADMIN) && $user->hasRole(UserRole::ADMIN) && $user->id !== auth()->id()) {
            throw new \RuntimeException("Admins cannot modify other admin accounts.");
        }

        if ($user->id === auth()->id()) {
            if (isset($data['is_active']) && !$data['is_active']) {
                throw new \RuntimeException("You cannot deactivate your own account.");
            }

            if (isset($data['role']) && $data['role'] !== auth()->user()->getRoleNames()->first()) {
                throw new \RuntimeException("You cannot change your own role.");
            }
        }

        return $this->userRepository->update($user, $data);
    }

    public function delete(User $user): void
    {
        if ($user->hasRole(UserRole::SUPER_ADMIN)) {
            throw new \RuntimeException("Super admin account cannot be deleted.");
        }

        if (auth()->user()->hasRole(UserRole::ADMIN) && $user->hasRole(UserRole::ADMIN)) {
            throw new \RuntimeException("Admins cannot delete other admin accounts.");
        }

        if ($user->id === auth()->id()) {
            throw new \RuntimeException("You cannot delete your own account.");
        }

        $this->userRepository->delete($user);
    }
}
