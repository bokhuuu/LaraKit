<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['event', 'model']);

        $activities = Activity::with(['causer'])
            ->when(
                $filters['event'] ?? null,
                fn ($q, $event) => $q->where('event', $event)
            )
            ->when(
                $filters['model'] ?? null,
                fn ($q, $model) => $q->where('subject_type', 'like', "%{$model}%")
            )
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/activity-log', [
            'activities' => $activities,
            'filters' => $filters,
        ]);
    }
}
