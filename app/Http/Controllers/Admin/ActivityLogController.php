<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

/**
 * Handles the activity log viewer page.
 *
 * Displays a paginated audit trail of all model mutations across the panel,
 * filterable by event type and model name.
 */
class ActivityLogController extends Controller
{
    /**
     * Returns paginated activity log entries with optional event and model filters.
     *
     * Filters by partial model name match to avoid exposing full
     * namespaced class names in the query string.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['event', 'model']);

        $activities = Activity::with(['causer'])
            ->when(
                $filters['event'] ?? null,
                fn($q, $event) => $q->where('event', $event)
            )
            ->when(
                $filters['model'] ?? null,
                fn($q, $model) => $q->where('subject_type', 'like', "%{$model}%")
            )
            ->latest()
            ->paginate(config('larakit.pagination'));

        return Inertia::render('admin/activity-log', [
            'activities' => $activities,
            'filters' => $filters,
        ]);
    }
}
