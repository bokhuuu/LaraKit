<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    public function index(): LengthAwarePaginator
    {
        return User::with('roles')->paginate(10);
    }
}
