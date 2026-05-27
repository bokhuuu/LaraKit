<?php

declare(strict_types=1);

namespace App\Http\Middleware\Admin;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards all admin routes with three sequential checks.
 *
 * Verifies the user is authenticated, their account is active,
 * and they hold either the admin or super_admin role.
 * Inactive users are logged out rather than just redirected.
 */
class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        if (! $user->is_active) {
            auth()->logout();

            return redirect()->route('login')
                ->with('error', 'Your account has been disabled.');
        }

        if (! $user->hasRole('admin') && ! $user->hasRole('super_admin')) {
            abort(403);
        }

        return $next($request);
    }
}
