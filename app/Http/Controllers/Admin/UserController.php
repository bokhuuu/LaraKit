<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => $this->userService->index()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/create', [
            'roles' => $this->userService->getAllRoles()
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        $this->userService->store($data);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(int $user)
    {
        $foundUser = $this->userService->findById($user);

        return Inertia::render('admin/users/edit', [
            'user' => $foundUser,
            'roles' => $this->userService->getAllRoles()
        ]);
    }

    public function update(UpdateUserRequest $request, int $user)
    {
        $data = $request->validated();
        $foundUser = $this->userService->findById($user);

        $this->userService->update($foundUser, $data);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }
}
