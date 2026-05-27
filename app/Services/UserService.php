<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\UserRole;
use App\Events\UserCreated;
use App\Models\User;
use App\Repositories\UserRepository;

class UserService
{
    public function __construct(protected UserRepository $userRepository) {}

    public function index(array $filters = [])
    {
        return $this->userRepository->index($filters);
    }

    public function findById(int $id): User
    {
        return $this->userRepository->findById($id);
    }

    public function getAllRoles()
    {
        return $this->userRepository->getAllRoles();
    }

    public function findTrashedById(int $id): User
    {
        return $this->userRepository->findTrashedById($id);
    }

    public function store(array $data): User
    {
        if (
            in_array($data['role'], [UserRole::ADMIN->value, UserRole::SUPER_ADMIN->value])
            && ! auth()->user()->hasRole(UserRole::SUPER_ADMIN)
        ) {
            throw new \RuntimeException('Only super admin can create admin accounts.');
        }

        $user = $this->userRepository->store($data);

        UserCreated::dispatch($user);

        return $user;
    }

    public function update(User $user, array $data): User
    {
        if ($user->hasRole(UserRole::SUPER_ADMIN) && $user->id !== auth()->id()) {
            throw new \RuntimeException('Super admin account cannot be modified.');
        }

        if (auth()->user()->hasRole(UserRole::ADMIN) && $user->hasRole(UserRole::ADMIN) && $user->id !== auth()->id()) {
            throw new \RuntimeException('Admins cannot modify other admin accounts.');
        }

        if ($user->id === auth()->id()) {
            if (isset($data['is_active']) && ! $data['is_active']) {
                throw new \RuntimeException('You cannot deactivate your own account.');
            }

            if (isset($data['role']) && $data['role'] !== auth()->user()->getRoleNames()->first()) {
                throw new \RuntimeException('You cannot change your own role.');
            }
        }

        return $this->userRepository->update($user, $data);
    }

    public function delete(User $user): void
    {
        $this->assertCanManageUser($user);
        $this->userRepository->delete($user);
    }

    public function trashed()
    {
        return $this->userRepository->trashed();
    }

    public function restore(User $user): void
    {
        $this->assertCanManageUser($user);
        $this->userRepository->restore($user);
    }

    public function forceDelete(User $user): void
    {
        $this->assertCanManageUser($user);
        $this->userRepository->forceDelete($user);
    }

    private function assertCanManageUser(User $user): void
    {
        if ($user->hasRole(UserRole::SUPER_ADMIN)) {
            throw new \RuntimeException('Super admin account cannot be managed.');
        }

        if (auth()->user()->hasRole(UserRole::ADMIN) && $user->hasRole(UserRole::ADMIN)) {
            throw new \RuntimeException('Admins cannot manage other admin accounts.');
        }

        if ($user->id === auth()->id()) {
            throw new \RuntimeException('You cannot manage your own account.');
        }
    }
}
