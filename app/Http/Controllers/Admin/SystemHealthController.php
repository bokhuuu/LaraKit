<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Services\SystemHealthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

/**
 * Handles HTTP requests for the System Health and Maintenance panel.
 *
 * Access is restricted to super_admin only.
 * All logic is delegated to SystemHealthService.
 */
class SystemHealthController extends Controller
{
    public function __construct(protected SystemHealthService $systemHealthService) {}

    /**
     * Renders the System Health panel with a full infrastructure snapshot.
     *
     * Aborts with 403 if the authenticated user is not a super admin.
     */
    public function index(): Response
    {
        abort_unless(
            auth()->user()->hasRole(UserRole::SUPER_ADMIN),
            403
        );

        return Inertia::render('admin/system-health/index', [
            'snapshot' => $this->systemHealthService->getSnapshot(),
        ]);
    }

    /**
     * Clears the specified Laravel cache type.
     *
     * Accepts: config, route, view.
     * Returns a success flash message on completion.
     */
    public function clearCache(Request $request): RedirectResponse
    {
        abort_unless(
            auth()->user()->hasRole(UserRole::SUPER_ADMIN),
            403
        );

        $validated = $request->validate([
            'type' => ['required', 'string', 'in:config,route,view'],
        ]);

        $this->systemHealthService->clearCache($validated['type']);

        return back()->with('success', ucfirst($validated['type']) . ' cache cleared successfully.');
    }

    /**
     * Toggles Laravel maintenance mode on or off.
     *
     * Returns a flash message reflecting the new state.
     */
    public function toggleMaintenance(): RedirectResponse
    {
        abort_unless(
            auth()->user()->hasRole(UserRole::SUPER_ADMIN),
            403
        );

        $isNowDown = $this->systemHealthService->toggleMaintenance();

        $message = $isNowDown
            ? 'Maintenance mode enabled.'
            : 'Maintenance mode disabled. App is live.';

        return back()->with('success', $message);
    }
}
