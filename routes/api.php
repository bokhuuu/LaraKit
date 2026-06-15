<?php

declare(strict_types=1);

use App\Modules\Posts\Api\PostApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => response()->json([
        'status' => 'ok',
        'version' => 'v1',
        'time' => now()->toDateTimeString(),
    ]));

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/posts', [PostApiController::class, 'index']);
        Route::get('/posts/{slug}', [PostApiController::class, 'show']);
    });
});
