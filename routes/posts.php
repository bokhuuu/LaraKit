<?php

declare(strict_types=1);

use App\Modules\Posts\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/posts')
    ->middleware(['web', 'auth', 'admin'])
    ->name('admin.posts.')
    ->group(function () {
        Route::get('/',                    [PostController::class, 'index'])->name('index');
        Route::get('/create',              [PostController::class, 'create'])->name('create');
        Route::post('/',                   [PostController::class, 'store'])->name('store');
        Route::get('/{post}/edit',         [PostController::class, 'edit'])->name('edit');
        Route::put('/{post}',              [PostController::class, 'update'])->name('update');
        Route::delete('/{post}',           [PostController::class, 'destroy'])->name('destroy');

        Route::get('/trash',               [PostController::class, 'trash'])->name('trash');
        Route::post('/{id}/restore',       [PostController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force-delete', [PostController::class, 'forceDelete'])->name('forceDelete');

        Route::get('/{post}/pdf', [PostController::class, 'exportPdf'])->name('exportPdf');
    });
