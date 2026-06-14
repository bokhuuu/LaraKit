<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Laravel\Horizon\Contracts\MasterSupervisorRepository;

/**
 * Collects real-time infrastructure metrics for the System Health panel.
 *
 * Talks directly to Horizon, Redis and Laravel internals.
 * No repository needed - no database models are involved.
 */
class SystemHealthService
{
    /**
     * Returns a full snapshot of the current system health.
     *
     * Assembles Horizon status, Redis memory, failed job count,
     * maintenance mode state and runtime version info into one array
     * for the frontend to consume.
     */
    public function getSnapshot(): array
    {
        return [
            'horizon'      => $this->getHorizonStatus(),
            'redis'        => $this->getRedisMemory(),
            'failed_jobs'  => $this->getFailedJobCount(),
            'versions'     => $this->getVersions(),
            'maintenance'  => app()->isDownForMaintenance(),
        ];
    }

    /**
     * Returns Horizon's current status string.
     *
     * Possible values: running, paused, inactive.
     * Returns 'disabled' when the Horizon check is turned off via config.
     */
    private function getHorizonStatus(): string
    {
        if (! config('larakit.health.horizon_check_enabled')) {
            return 'disabled';
        }

        try {
            $masters = app(MasterSupervisorRepository::class)->all();
            if (empty($masters)) {
                return 'inactive';
            }

            return collect($masters)->every(
                fn($master) => $master->status === 'paused'
            ) ? 'paused' : 'running';
        } catch (\Exception) {
            return 'inactive';
        }
    }

    /**
     * Returns Redis memory usage in human-readable megabytes.
     *
     * Reads used_memory_human from Redis INFO command.
     * Returns 'unavailable' if Redis is unreachable.
     */
    private function getRedisMemory(): string
    {
        try {
            $info = Redis::info('memory');
            return $info['used_memory_human'] ?? 'unavailable';
        } catch (\Exception) {
            return 'unavailable';
        }
    }

    /**
     * Returns the total count of failed jobs in the failed_jobs table.
     */
    private function getFailedJobCount(): int
    {
        try {
            return DB::table('failed_jobs')->count();
        } catch (\Exception) {
            return 0;
        }
    }

    /**
     * Returns PHP and Laravel version strings for display.
     */
    private function getVersions(): array
    {
        return [
            'php'     => phpversion(),
            'laravel' => app()->version(),
        ];
    }

    /**
     * Clears one of the three supported Laravel caches.
     *
     * Accepted types: config, route, view.
     * Throws if an unsupported type is passed.
     */
    public function clearCache(string $type): void
    {
        $allowed = ['config', 'route', 'view'];

        if (! in_array($type, $allowed, strict: true)) {
            throw new \InvalidArgumentException("Unsupported cache type: {$type}");
        }

        Artisan::call("{$type}:clear");
    }

    /**
     * Toggles Laravel maintenance mode on or off.
     *
     * Uses artisan up/down commands - same as running them from the terminal.
     */
    public function toggleMaintenance(): bool
    {
        if (app()->isDownForMaintenance()) {
            Artisan::call('up');
            return false;
        }

        Artisan::call('down', [
            '--secret' => config('larakit.health.maintenance_secret'),
        ]);

        return true;
    }
}
