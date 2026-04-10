<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
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
}
