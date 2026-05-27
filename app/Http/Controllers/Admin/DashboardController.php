<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'inactive_users' => User::where('is_active', false)->count(),
            'trashed_users' => User::onlyTrashed()->count(),
            'total_activities' => Activity::count(),
            'today_activities' => Activity::whereDate('created_at', today())->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }
}
