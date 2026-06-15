<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Manages personal access tokens for API authentication.
 */
class TokenController extends Controller
{
    /**
     * Display all tokens for the authenticated user.
     */
    public function index(Request $request): Response
    {
        $tokens = $request->user()
            ->tokens()
            ->latest()
            ->get()
            ->map(fn ($token) => [
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
     * Issue a new personal access token.
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
     * Revoke a token.
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $request->user()->tokens()->findOrFail($id)->delete();

        return redirect()->route('admin.tokens.index')
            ->with('success', 'Token revoked.');
    }
}
