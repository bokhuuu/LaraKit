<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
}
