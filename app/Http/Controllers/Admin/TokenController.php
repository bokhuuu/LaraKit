<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Manages personal access tokens for Sanctum API authentication.
 *
 * Tokens are created, listed and revoked from the admin panel.
 * The plain text token is only available immediately after creation -
 * it is flashed to the session and shown once, then discarded.
 */
class TokenController extends Controller
{
    /**
     * Renders the token list for the authenticated user.
     *
     * Passes the newToken session value so the UI can display
     * the plain text token immediately after creation.
     */
    public function index(Request $request): Response
    {
        $tokens = $request->user()
            ->tokens()
            ->latest()
            ->get()
            ->map(fn($token) => [
                'id' => $token->id,
                'name' => $token->name,
                'last_used' => $token->last_used_at?->diffForHumans(),
                'created_at' => $token->created_at->toDateString(),
            ]);

        return Inertia::render('admin/tokens/index', [
            'tokens' => $tokens,
            'newToken' => session('newToken'),
        ]);
    }

    /**
     * Issues a new named Sanctum token and flashes the plain text value to the session.
     *
     * The plain text token is only accessible on the next request -
     * after that it cannot be retrieved again.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $token = $request->user()->createToken($request->name);

        return redirect()->route('admin.tokens.index')
            ->with('newToken', $token->plainTextToken);
    }

    /**
     * Revokes the specified token by deleting it from the database.
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $request->user()->tokens()->findOrFail($id)->delete();

        return redirect()->route('admin.tokens.index')
            ->with('success', 'Token revoked.');
    }
}
