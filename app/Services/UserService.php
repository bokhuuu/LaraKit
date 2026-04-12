<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;

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
        return $this->userRepository->store($data);
    }

    public function findById(int $id): User
    {
        return $this->userRepository->findById($id);
    }

    public function update(User $user, array $data): User
    {
        return $this->userRepository->update($user, $data);
    }
}
